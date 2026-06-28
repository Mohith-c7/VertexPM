import { ConditionType } from "../types";
import { ConditionContext, ConditionHandler } from "./condition.types.js";
import { db } from "../../../db.js";

const PRIORITY_ORDER: Record<string, number> = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  URGENT: 3,
  CRITICAL: 4,
};

export class ConditionRegistry {
  private static instance: ConditionRegistry;
  private handlers: Map<ConditionType, ConditionHandler> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): ConditionRegistry {
    if (!ConditionRegistry.instance) {
      ConditionRegistry.instance = new ConditionRegistry();
    }
    return ConditionRegistry.instance;
  }

  register(handler: ConditionHandler): void {
    this.handlers.set(handler.type, handler);
  }

  get(type: ConditionType): ConditionHandler | undefined {
    return this.handlers.get(type);
  }

  private registerDefaults(): void {
    // 1. STATUS_EQUALS
    this.register({
      type: "STATUS_EQUALS",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item) return false;
        const targetStatus = config.status || config.value;
        return item.status === targetStatus;
      },
    });

    // 2. STATUS_NOT_EQUALS
    this.register({
      type: "STATUS_NOT_EQUALS",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item) return false;
        const targetStatus = config.status || config.value;
        return item.status !== targetStatus;
      },
    });

    // 3. PRIORITY_EQUALS
    this.register({
      type: "PRIORITY_EQUALS",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item) return false;
        const targetPriority = config.priority || config.value;
        return item.priority === targetPriority;
      },
    });

    // 4. PRIORITY_GREATER_THAN
    this.register({
      type: "PRIORITY_GREATER_THAN",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item) return false;
        const targetPriority = config.priority || config.value;
        const currentScore = PRIORITY_ORDER[item.priority] ?? -1;
        const targetScore = PRIORITY_ORDER[targetPriority] ?? -1;
        return currentScore > targetScore;
      },
    });

    // 5. LABEL_EXISTS
    this.register({
      type: "LABEL_EXISTS",
      evaluate: async (ctx, config) => {
        const targetLabel = config.label || config.value;
        // Check event metadata or workItem fields if any exist in the future
        if (ctx.event?.metadata?.labels && Array.isArray(ctx.event.metadata.labels)) {
          return ctx.event.metadata.labels.includes(targetLabel);
        }
        const item = await this.resolveWorkItem(ctx);
        if (item && (item as any).labels && Array.isArray((item as any).labels)) {
          return (item as any).labels.includes(targetLabel);
        }
        return false;
      },
    });

    // 6. ASSIGNEE_EXISTS
    this.register({
      type: "ASSIGNEE_EXISTS",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        return !!item?.assigneeId;
      },
    });

    // 7. DUE_DATE_BEFORE
    this.register({
      type: "DUE_DATE_BEFORE",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item?.dueDate) return false;
        const targetDate = new Date(config.date || config.value);
        return new Date(item.dueDate).getTime() < targetDate.getTime();
      },
    });

    // 8. DUE_DATE_AFTER
    this.register({
      type: "DUE_DATE_AFTER",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item?.dueDate) return false;
        const targetDate = new Date(config.date || config.value);
        return new Date(item.dueDate).getTime() > targetDate.getTime();
      },
    });

    // 9. ESTIMATE_GREATER_THAN
    this.register({
      type: "ESTIMATE_GREATER_THAN",
      evaluate: async (ctx, config) => {
        const item = await this.resolveWorkItem(ctx);
        if (!item) return false;
        const targetVal = Number(config.estimate || config.value);
        const est = item.estimate ? Number(item.estimate) : (item.storyPoints ?? 0);
        return est > targetVal;
      },
    });

    // 10. WORKSPACE
    this.register({
      type: "WORKSPACE",
      evaluate: async (ctx, config) => {
        const targetWorkspaceId = config.workspaceId || config.value;
        return ctx.workspaceId === targetWorkspaceId;
      },
    });

    // 11. PROJECT
    this.register({
      type: "PROJECT",
      evaluate: async (ctx, config) => {
        const targetProjectId = config.projectId || config.value;
        if (ctx.projectId) {
          return ctx.projectId === targetProjectId;
        }
        const item = await this.resolveWorkItem(ctx);
        if (item) {
          return item.board?.projectId === targetProjectId;
        }
        return false;
      },
    });

    // 12. BOARD
    this.register({
      type: "BOARD",
      evaluate: async (ctx, config) => {
        const targetBoardId = config.boardId || config.value;
        if (ctx.boardId) {
          return ctx.boardId === targetBoardId;
        }
        const item = await this.resolveWorkItem(ctx);
        return item?.boardId === targetBoardId;
      },
    });
  }

  private async resolveWorkItem(ctx: ConditionContext) {
    if (ctx.entityType !== "WorkItem") return null;
    try {
      return await db.workItem.findUnique({
        where: { id: ctx.entityId },
        include: {
          board: {
            select: { projectId: true }
          }
        }
      });
    } catch {
      return null;
    }
  }
}

export const conditionRegistry = ConditionRegistry.getInstance();
