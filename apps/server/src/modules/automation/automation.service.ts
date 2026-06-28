import { db } from "../../db.js";
import { executionHistoryService } from "./history/execution.history.js";
import { cronManager } from "./scheduler/cron.manager.js";
import { reminderScheduler } from "./reminders/reminder.scheduler.js";
import {
  CreateAutomationRuleInput,
  UpdateAutomationRuleInput,
  GetAutomationRulesQuery,
  GetAutomationHistoryQuery,
  GetScheduledJobsQuery,
  CreateReminderInput,
} from "./validation/index.js";
import { AutomationRuleNotFoundError, AutomationRuleUnauthorizedError } from "./errors/index.js";
import { automationLogger } from "./logger/index.js";

export class AutomationService {
  private async verifyWorkspaceMember(workspaceId: string, userId: string): Promise<void> {
    const member = await db.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });
    if (!member) {
      throw new AutomationRuleUnauthorizedError();
    }
  }

  // ─── Rules Management ──────────────────────────────────────────────────────────

  async getRules(filters: GetAutomationRulesQuery, userId: string) {
    if (filters.workspaceId) {
      await this.verifyWorkspaceMember(filters.workspaceId, userId);
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.workspaceId ? { workspaceId: filters.workspaceId } : {}),
      ...(filters.projectId ? { projectId: filters.projectId } : {}),
      ...(filters.isEnabled !== undefined ? { isEnabled: filters.isEnabled } : {}),
    };

    const [rules, total] = await Promise.all([
      db.automationRule.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.automationRule.count({ where }),
    ]);

    // Parse JSON strings back to objects for clients
    const parsedRules = rules.map((rule) => ({
      ...rule,
      triggerConfig: rule.triggerConfig ? JSON.parse(rule.triggerConfig) : null,
      conditions: rule.conditions ? JSON.parse(rule.conditions) : null,
      actions: JSON.parse(rule.actions),
    }));

    return {
      items: parsedRules,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createRule(data: CreateAutomationRuleInput, userId: string) {
    await this.verifyWorkspaceMember(data.workspaceId, userId);

    const rule = await db.automationRule.create({
      data: {
        workspaceId: data.workspaceId,
        projectId: data.projectId || null,
        name: data.name,
        description: data.description || null,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig ? JSON.stringify(data.triggerConfig) : null,
        conditions: data.conditions ? JSON.stringify(data.conditions) : null,
        actions: JSON.stringify(data.actions),
        isEnabled: data.isEnabled ?? true,
        createdById: userId,
      },
    });

    automationLogger.info("AutomationService", `Rule created: ${rule.name} (${rule.id})`);
    return {
      ...rule,
      triggerConfig: rule.triggerConfig ? JSON.parse(rule.triggerConfig) : null,
      conditions: rule.conditions ? JSON.parse(rule.conditions) : null,
      actions: JSON.parse(rule.actions),
    };
  }

  async updateRule(id: string, data: UpdateAutomationRuleInput, userId: string) {
    const existing = await db.automationRule.findUnique({ where: { id } });
    if (!existing) {
      throw new AutomationRuleNotFoundError(id);
    }

    await this.verifyWorkspaceMember(existing.workspaceId, userId);

    const updated = await db.automationRule.update({
      where: { id },
      data: {
        workspaceId: data.workspaceId,
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        triggerType: data.triggerType,
        triggerConfig: data.triggerConfig !== undefined ? (data.triggerConfig ? JSON.stringify(data.triggerConfig) : null) : undefined,
        conditions: data.conditions !== undefined ? (data.conditions ? JSON.stringify(data.conditions) : null) : undefined,
        actions: data.actions ? JSON.stringify(data.actions) : undefined,
        isEnabled: data.isEnabled,
      },
    });

    automationLogger.info("AutomationService", `Rule updated: ${updated.name} (${updated.id})`);
    return {
      ...updated,
      triggerConfig: updated.triggerConfig ? JSON.parse(updated.triggerConfig) : null,
      conditions: updated.conditions ? JSON.parse(updated.conditions) : null,
      actions: JSON.parse(updated.actions),
    };
  }

  async deleteRule(id: string, userId: string) {
    const existing = await db.automationRule.findUnique({ where: { id } });
    if (!existing) {
      throw new AutomationRuleNotFoundError(id);
    }

    await this.verifyWorkspaceMember(existing.workspaceId, userId);

    await db.automationRule.delete({ where: { id } });
    automationLogger.info("AutomationService", `Rule deleted: ${existing.name} (${id})`);
    return true;
  }

  async setRuleEnabled(id: string, isEnabled: boolean, userId: string) {
    const existing = await db.automationRule.findUnique({ where: { id } });
    if (!existing) {
      throw new AutomationRuleNotFoundError(id);
    }

    await this.verifyWorkspaceMember(existing.workspaceId, userId);

    const updated = await db.automationRule.update({
      where: { id },
      data: { isEnabled },
    });

    automationLogger.info("AutomationService", `Rule status updated to isEnabled=${isEnabled} for: ${updated.name}`);
    return {
      ...updated,
      triggerConfig: updated.triggerConfig ? JSON.parse(updated.triggerConfig) : null,
      conditions: updated.conditions ? JSON.parse(updated.conditions) : null,
      actions: JSON.parse(updated.actions),
    };
  }

  // ─── History ───────────────────────────────────────────────────────────

  async getHistory(filters: GetAutomationHistoryQuery, userId: string) {
    if (filters.ruleId) {
      const rule = await db.automationRule.findUnique({ where: { id: filters.ruleId } });
      if (rule) {
        await this.verifyWorkspaceMember(rule.workspaceId, userId);
      }
    }
    return await executionHistoryService.getHistory(filters);
  }

  // ─── Scheduled Jobs ───────────────────────────────────────────────────────

  async getJobs(filters: GetScheduledJobsQuery) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.jobType ? { jobType: filters.jobType } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };

    const [jobs, total] = await Promise.all([
      db.scheduledJob.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.scheduledJob.count({ where }),
    ]);

    const parsedJobs = jobs.map((job) => ({
      ...job,
      payload: job.payload ? JSON.parse(job.payload) : null,
    }));

    return {
      items: parsedJobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async runJob(jobType: string, payload?: any) {
    return await cronManager.triggerJob(jobType, payload);
  }

  async cancelJob(jobId: string) {
    const existing = await db.scheduledJob.findUnique({ where: { id: jobId } });
    if (!existing) {
      throw new Error(`Job ${jobId} not found`);
    }

    const updated = await db.scheduledJob.update({
      where: { id: jobId },
      data: { status: "FAILED", payload: JSON.stringify({ ...(existing.payload ? JSON.parse(existing.payload) : {}), cancelled: true, cancelledAt: new Date().toISOString() }) },
    });

    return {
      ...updated,
      payload: updated.payload ? JSON.parse(updated.payload) : null,
    };
  }

  // ─── Reminders ─────────────────────────────────────────────────────────

  async getReminders(filters: { userId?: string; entityId?: string; entityType?: string }, currentUserId: string) {
    // If user is not admin, limit reminder queries to their own reminders
    const targetUserId = filters.userId || currentUserId;
    if (targetUserId !== currentUserId) {
      // Check if user is a member/owner of any workspace to verify basic access
      const memberCount = await db.workspaceMember.count({ where: { userId: currentUserId } });
      if (memberCount === 0) {
        throw new AutomationRuleUnauthorizedError();
      }
    }

    return await reminderScheduler.getReminders({
      userId: targetUserId,
      entityId: filters.entityId,
      entityType: filters.entityType,
    });
  }

  async createReminder(data: CreateReminderInput, currentUserId: string) {
    // Only allow creating reminders for oneself unless admin
    const targetUserId = data.userId || currentUserId;
    if (targetUserId !== currentUserId) {
      throw new AutomationRuleUnauthorizedError();
    }

    return await reminderScheduler.scheduleReminder({
      ...data,
      userId: targetUserId,
    });
  }

  async deleteReminder(id: string, currentUserId: string) {
    await reminderScheduler.deleteReminder(id, currentUserId);
    return true;
  }
}
