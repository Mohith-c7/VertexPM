import { db } from "../../../db.js";
import { automationLogger } from "../logger/index.js";

export class ExecutionHistoryService {
  async logExecution(data: {
    ruleId: string;
    triggerType: string;
    status: "SUCCESS" | "FAILED" | "RETRY";
    durationMs?: number;
    actionsRun?: number;
    failureReason?: string;
    retryCount?: number;
  }) {
    try {
      return await db.executionLog.create({
        data: {
          ruleId: data.ruleId,
          triggerType: data.triggerType,
          status: data.status,
          durationMs: data.durationMs ?? 0,
          actionsRun: data.actionsRun ?? 0,
          failureReason: data.failureReason || null,
          retryCount: data.retryCount ?? 0,
        },
      });
    } catch (err) {
      automationLogger.error("ExecutionHistoryService", "Failed to log execution history", { error: String(err), data });
    }
  }

  async getHistory(filters: { ruleId?: string; page?: number; limit?: number }) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.ruleId ? { ruleId: filters.ruleId } : {}),
    };

    const [items, total] = await Promise.all([
      db.executionLog.findMany({
        where,
        orderBy: { executedAt: "desc" },
        skip,
        take: limit,
        include: {
          rule: {
            select: { name: true },
          },
        },
      }),
      db.executionLog.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const executionHistoryService = new ExecutionHistoryService();
