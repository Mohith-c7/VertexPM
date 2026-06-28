import cron from "node-cron";
import { db } from "../../../db.js";
import { jobExecutor } from "./job.executor.js";
import { automationLogger } from "../logger/index.js";

const CRON_JOBS = [
  { type: "due-date-reminder", expression: "0 * * * *" },
  { type: "overdue-reminder", expression: "0 * * * *" },
  { type: "daily-digest", expression: "0 8 * * *" },
  { type: "weekly-digest", expression: "0 8 * * 1" },
  { type: "cleanup-notifications", expression: "0 0 * * *" },
  { type: "retry-failed-jobs", expression: "*/15 * * * *" },
  { type: "health-check", expression: "*/5 * * * *" },
];

export class CronManager {
  private static instance: CronManager;
  private tasks: any[] = [];

  static getInstance(): CronManager {
    if (!CronManager.instance) {
      CronManager.instance = new CronManager();
    }
    return CronManager.instance;
  }

  startAll(): void {
    automationLogger.info("CronManager", "Starting all cron schedules");
    
    // Stop any existing tasks first
    this.stopAll();

    for (const job of CRON_JOBS) {
      if (!cron.validate(job.expression)) {
        automationLogger.error("CronManager", `Invalid cron expression for job ${job.type}: ${job.expression}`);
        continue;
      }

      const task = cron.schedule(job.expression, async () => {
        automationLogger.info("CronManager", `Cron trigger fired for job: ${job.type}`);
        try {
          await this.triggerJob(job.type);
        } catch (err) {
          automationLogger.error("CronManager", `Error triggering job: ${job.type}`, { error: String(err) });
        }
      });

      this.tasks.push(task);
      automationLogger.info("CronManager", `Scheduled job ${job.type} with expression: ${job.expression}`);
    }
  }

  stopAll(): void {
    if (this.tasks.length > 0) {
      automationLogger.info("CronManager", `Stopping ${this.tasks.length} cron schedules`);
      for (const task of this.tasks) {
        task.stop();
      }
      this.tasks = [];
    }
  }

  async triggerJob(jobType: string, payload?: any): Promise<any> {
    automationLogger.debug("CronManager", `Triggering job ${jobType} in DB`);
    const job = await db.scheduledJob.create({
      data: {
        jobType,
        payload: payload ? JSON.stringify(payload) : null,
        status: "PENDING",
        nextRunAt: new Date(),
        maxRetries: 3,
      },
    });

    // Run execution asynchronously
    jobExecutor.executeJob(job.id).catch((err) => {
      automationLogger.error("CronManager", `Asynchronous execution failed for job ${job.id}`, { error: String(err) });
    });

    return job;
  }
}

export const cronManager = CronManager.getInstance();
