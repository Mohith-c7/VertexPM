import { ActionType } from "../types";
import { ActionContext, ActionHandler } from "./action.types.js";
import { db } from "../../../db.js";
import { notificationDispatcher } from "../../notifications/dispatcher/notification.dispatcher.js";
import { automationLogger } from "../logger/index.js";

export class ActionRegistry {
  private static instance: ActionRegistry;
  private handlers: Map<ActionType, ActionHandler> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): ActionRegistry {
    if (!ActionRegistry.instance) {
      ActionRegistry.instance = new ActionRegistry();
    }
    return ActionRegistry.instance;
  }

  register(handler: ActionHandler): void {
    this.handlers.set(handler.type, handler);
  }

  get(type: ActionType): ActionHandler | undefined {
    return this.handlers.get(type);
  }

  private registerDefaults(): void {
    // 1. CREATE_NOTIFICATION
    this.register({
      type: "CREATE_NOTIFICATION",
      execute: async (ctx, config) => {
        let recipientIds: string[] = [];
        if (config.recipientId) {
          if (config.recipientId === "assignee" || config.recipientId === "reporter") {
            const item = await this.loadWorkItem(ctx.entityId);
            if (item) {
              const rId = config.recipientId === "assignee" ? item.assigneeId : item.reporterId;
              if (rId) recipientIds.push(rId);
            }
          } else {
            recipientIds.push(config.recipientId);
          }
        } else {
          // If no recipientId is specified, try to notify the assignee
          const item = await this.loadWorkItem(ctx.entityId);
          if (item?.assigneeId) {
            recipientIds.push(item.assigneeId);
          }
        }

        if (recipientIds.length === 0) {
          automationLogger.warn("ActionRegistry", "No recipients resolved for CREATE_NOTIFICATION action", { config });
          return;
        }

        const notificationEvent = {
          type: "AUTOMATION",
          actorId: ctx.actorId,
          entityId: ctx.entityId,
          entityType: ctx.entityType,
          workspaceId: ctx.workspaceId,
          projectId: ctx.projectId,
          metadata: {
            title: config.title || "Automation Triggered",
            body: config.body || "An automation rule has been executed.",
          },
        };

        await notificationDispatcher.dispatch(notificationEvent as any, recipientIds);
      },
    });

    // 2. ASSIGN_USER
    this.register({
      type: "ASSIGN_USER",
      execute: async (ctx, config) => {
        if (ctx.entityType !== "WorkItem") return;
        const assigneeId = config.assigneeId || null;
        await db.workItem.update({
          where: { id: ctx.entityId },
          data: { assigneeId },
        });
      },
    });

    // 3. MOVE_WORKITEM
    this.register({
      type: "MOVE_WORKITEM",
      execute: async (ctx, config) => {
        if (ctx.entityType !== "WorkItem") return;
        const columnId = config.columnId;
        if (!columnId) throw new Error("columnId is required for MOVE_WORKITEM action");
        await db.workItem.update({
          where: { id: ctx.entityId },
          data: { columnId },
        });
      },
    });

    // 4. CHANGE_STATUS
    this.register({
      type: "CHANGE_STATUS",
      execute: async (ctx, config) => {
        if (ctx.entityType !== "WorkItem") return;
        const status = config.status || config.value;
        if (!status) throw new Error("status is required for CHANGE_STATUS action");
        await db.workItem.update({
          where: { id: ctx.entityId },
          data: { status },
        });
      },
    });

    // 5. CHANGE_PRIORITY
    this.register({
      type: "CHANGE_PRIORITY",
      execute: async (ctx, config) => {
        if (ctx.entityType !== "WorkItem") return;
        const priority = config.priority || config.value;
        if (!priority) throw new Error("priority is required for CHANGE_PRIORITY action");
        await db.workItem.update({
          where: { id: ctx.entityId },
          data: { priority },
        });
      },
    });

    // 6. ADD_LABEL
    this.register({
      type: "ADD_LABEL",
      execute: async (ctx, config) => {
        if (ctx.entityType !== "WorkItem") return;
        const labelName = config.label || config.value;
        if (!labelName) return;

        // 1. Find or create the label in this workspace
        let label = await db.label.findUnique({
          where: {
            workspaceId_name: {
              workspaceId: ctx.workspaceId,
              name: labelName,
            },
          },
        });

        if (!label) {
          label = await db.label.create({
            data: {
              workspaceId: ctx.workspaceId,
              name: labelName,
              color: "#3B82F6", // Default blue color
            },
          });
        }

        // 2. Link it to the WorkItem
        try {
          await db.workItemLabel.upsert({
            where: {
              workItemId_labelId: {
                workItemId: ctx.entityId,
                labelId: label.id,
              },
            },
            create: {
              workItemId: ctx.entityId,
              labelId: label.id,
            },
            update: {},
          });
          automationLogger.info("ActionRegistry", `ADD_LABEL action executed: added label "${labelName}" to WorkItem ${ctx.entityId}`);
        } catch (err: any) {
          automationLogger.error("ActionRegistry", `Failed to add label "${labelName}" to WorkItem ${ctx.entityId}: ${err.message}`);
        }
      },
    });

    // 7. REMOVE_LABEL
    this.register({
      type: "REMOVE_LABEL",
      execute: async (ctx, config) => {
        if (ctx.entityType !== "WorkItem") return;
        const labelName = config.label || config.value;
        if (!labelName) return;

        const label = await db.label.findUnique({
          where: {
            workspaceId_name: {
              workspaceId: ctx.workspaceId,
              name: labelName,
            },
          },
        });

        if (!label) return;

        try {
          await db.workItemLabel.delete({
            where: {
              workItemId_labelId: {
                workItemId: ctx.entityId,
                labelId: label.id,
              },
            },
          });
          automationLogger.info("ActionRegistry", `REMOVE_LABEL action executed: removed label "${labelName}" from WorkItem ${ctx.entityId}`);
        } catch (err: any) {
          automationLogger.debug("ActionRegistry", `REMOVE_LABEL action no-op or failed: ${err.message}`);
        }
      },
    });

    // 8. CREATE_ACTIVITY
    this.register({
      type: "CREATE_ACTIVITY",
      execute: async (ctx, config) => {
        // Find a valid actorId
        let actorId = ctx.actorId;
        if (!actorId) {
          // If no actorId is found, use the rule creator or first active workspace member
          const firstMember = await db.workspaceMember.findFirst({
            where: { workspaceId: ctx.workspaceId },
            select: { userId: true },
          });
          actorId = firstMember?.userId;
        }

        if (!actorId) {
          automationLogger.warn("ActionRegistry", "Could not resolve an actor user for CREATE_ACTIVITY action");
          return;
        }

        await db.activityLog.create({
          data: {
            workspaceId: ctx.workspaceId,
            projectId: ctx.projectId || null,
            boardId: ctx.boardId || null,
            workItemId: ctx.entityType === "WorkItem" ? ctx.entityId : null,
            actorId,
            eventType: config.eventType || "WORKITEM_UPDATED",
            entityType: ctx.entityType,
            entityId: ctx.entityId,
            oldValue: config.oldValue || null,
            newValue: config.newValue || null,
            metadata: config.metadata ? JSON.stringify(config.metadata) : null,
          },
        });
      },
    });

    // 9. SCHEDULE_REMINDER
    this.register({
      type: "SCHEDULE_REMINDER",
      execute: async (ctx, config) => {
        let userId = config.userId;
        if (!userId || userId === "assignee" || userId === "reporter") {
          const item = await this.loadWorkItem(ctx.entityId);
          if (item) {
            userId = (userId === "reporter" ? item.reporterId : item.assigneeId) || ctx.actorId;
          } else {
            userId = ctx.actorId;
          }
        }

        if (!userId) {
          automationLogger.warn("ActionRegistry", "Could not resolve recipient userId for SCHEDULE_REMINDER");
          return;
        }

        let remindAt = config.remindAt ? new Date(config.remindAt) : null;
        if (!remindAt && config.delayMinutes) {
          remindAt = new Date(Date.now() + config.delayMinutes * 60 * 1000);
        }
        if (!remindAt) {
          remindAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Default to 24 hours from now
        }

        await db.reminder.create({
          data: {
            userId,
            entityId: ctx.entityId,
            entityType: ctx.entityType,
            type: config.type || "CUSTOM",
            message: config.message || `Automated reminder for ${ctx.entityType}`,
            remindAt,
          },
        });
      },
    });

    // 10. CANCEL_REMINDER
    this.register({
      type: "CANCEL_REMINDER",
      execute: async (ctx, config) => {
        await db.reminder.updateMany({
          where: {
            entityId: ctx.entityId,
            entityType: ctx.entityType,
            isCompleted: false,
            ...(config.type ? { type: config.type } : {}),
            ...(config.userId ? { userId: config.userId } : {}),
          },
          data: { isCompleted: true },
        });
      },
    });
  }

  private async loadWorkItem(id: string) {
    try {
      return await db.workItem.findUnique({
        where: { id },
      });
    } catch {
      return null;
    }
  }
}

export const actionRegistry = ActionRegistry.getInstance();
