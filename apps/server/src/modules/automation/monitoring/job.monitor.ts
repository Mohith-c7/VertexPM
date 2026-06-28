import { db } from "../../../db.js";

export class JobMonitor {
  async getMetrics() {
    const [pending, running, completed, failed] = await Promise.all([
      db.scheduledJob.count({ where: { status: "PENDING" } }),
      db.scheduledJob.count({ where: { status: "RUNNING" } }),
      db.scheduledJob.count({ where: { status: "COMPLETED" } }),
      db.scheduledJob.count({ where: { status: "FAILED" } }),
    ]);

    const [ruleSuccessCount, ruleFailedCount] = await Promise.all([
      db.executionLog.count({ where: { status: "SUCCESS" } }),
      db.executionLog.count({ where: { status: "FAILED" } }),
    ]);

    return {
      jobs: {
        pending,
        running,
        completed,
        failed,
      },
      rules: {
        success: ruleSuccessCount,
        failed: ruleFailedCount,
      },
    };
  }
}

export const jobMonitor = new JobMonitor();
