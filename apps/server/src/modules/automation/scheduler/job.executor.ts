import { db } from "../../../db.js";
import { jobRegistry } from "./job.registry.js";
import { retryPolicy } from "./retry.policy.js";
import { automationLogger } from "../logger/index.js";

export class JobExecutor {
  async executeJob(jobId: string): Promise<void> {
    const job = await db.scheduledJob.findUnique({ where: { id: jobId } });
    if (!job) {
      automationLogger.warn("JobExecutor", `Job with id ${jobId} not found`);
      return;
    }

    if (job.status === "RUNNING") {
      automationLogger.debug("JobExecutor", `Job ${jobId} is already running, skipping`);
      return;
    }

    // Set job to RUNNING
    await db.scheduledJob.update({
      where: { id: jobId },
      data: { status: "RUNNING", lastRunAt: new Date() },
    });

    const handler = jobRegistry.get(job.jobType);
    if (!handler) {
      const errorMsg = `No handler registered for job type ${job.jobType}`;
      automationLogger.error("JobExecutor", errorMsg);
      await db.scheduledJob.update({
        where: { id: jobId },
        data: { status: "FAILED" },
      });
      return;
    }

    const payload = job.payload ? JSON.parse(job.payload) : undefined;

    try {
      await handler.run(payload);

      // Complete job
      await db.scheduledJob.update({
        where: { id: jobId },
        data: { status: "COMPLETED", retryCount: 0 },
      });
      automationLogger.info("JobExecutor", `Job ${job.jobType} (${jobId}) completed successfully`);
    } catch (err: any) {
      automationLogger.error("JobExecutor", `Job ${job.jobType} (${jobId}) failed: ${err.message}`, { error: String(err) });

      const nextRetryCount = job.retryCount + 1;
      const maxRetries = job.maxRetries ?? 3;
      const shouldRetry = nextRetryCount <= maxRetries && retryPolicy.shouldRetry(err);

      if (shouldRetry) {
        const delay = retryPolicy.calculateBackoff(job.retryCount);
        const nextRunAt = new Date(Date.now() + delay);

        await db.scheduledJob.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            retryCount: nextRetryCount,
            nextRunAt,
          },
        });
        automationLogger.warn("JobExecutor", `Scheduled retry ${nextRetryCount}/${maxRetries} for job ${job.jobType} in ${delay}ms`);
      } else {
        await db.scheduledJob.update({
          where: { id: jobId },
          data: {
            status: "FAILED",
            retryCount: nextRetryCount,
          },
        });
        automationLogger.error("JobExecutor", `Job ${job.jobType} exceeded max retries or is not retryable`);
      }
    }
  }
}

export const jobExecutor = new JobExecutor();
