import { DomainEvent, NotificationType } from "../types";
import { notificationEngine } from "../engine/notification.engine";
import { mentionDetector } from "../mentions/mention.detector";
import { eventSubscriber } from "./event.subscriber";
import { notificationLogger } from "../logger";
import { db } from "../../../db";
import { Notification } from "@prisma/client";

const LOG_CTX = "NotificationDispatcher";

/**
 * THE only public entry point for all notification creation.
 * No other module should create notifications directly.
 *
 * Flow:
 *   Domain Event → NotificationDispatcher.dispatch()
 *   → RecipientResolver → NotificationBuilder → NotificationEngine
 *   → DeliveryManager → ChannelDispatcher → Repository → Socket
 */
export class NotificationDispatcher {
  private static instance: NotificationDispatcher;

  private constructor() {
    this.setupEventHandlers();
  }

  static getInstance(): NotificationDispatcher {
    if (!NotificationDispatcher.instance) {
      NotificationDispatcher.instance = new NotificationDispatcher();
    }
    return NotificationDispatcher.instance;
  }

  /** Register handlers for all supported notification types */
  private setupEventHandlers(): void {
    eventSubscriber.on(NotificationType.ASSIGNMENT, (e) => this.handleAssignment(e));
    eventSubscriber.on(NotificationType.MENTION, (e) => this.handleMention(e));
    eventSubscriber.on(NotificationType.COMMENT, (e) => this.handleComment(e));
    eventSubscriber.on(NotificationType.REPLY, (e) => this.handleReply(e));
    eventSubscriber.on(NotificationType.STATUS_CHANGE, (e) => this.handleStatusChange(e));
    eventSubscriber.on(NotificationType.PRIORITY_CHANGE, (e) => this.handlePriorityChange(e));
    eventSubscriber.on(NotificationType.DUE_DATE, (e) => this.handleDueDate(e));
    eventSubscriber.on(NotificationType.BOARD_UPDATE, (e) => this.handleBoardUpdate(e));
    eventSubscriber.on(NotificationType.PROJECT_UPDATE, (e) => this.handleProjectUpdate(e));
    eventSubscriber.on(NotificationType.WORKSPACE_UPDATE, (e) => this.handleWorkspaceUpdate(e));
    eventSubscriber.on(NotificationType.SYSTEM, (e) => this.handleSystem(e));
    eventSubscriber.on(NotificationType.SECURITY, (e) => this.handleSecurity(e));
    notificationLogger.info(LOG_CTX, "All event handlers registered");
  }

  /**
   * Primary dispatch method. Called by other modules to trigger a notification.
   */
  async dispatch(event: DomainEvent, recipientIds: string[]): Promise<Notification[]> {
    notificationLogger.info(LOG_CTX, `Dispatching ${event.type}`, {
      entityId: event.entityId,
      recipientCount: recipientIds.length,
    });

    const actorName = await notificationEngine.getActorName(event.actorId);
    const entityTitle = await this.resolveEntityTitle(event.entityType, event.entityId);

    const vars: Record<string, string | undefined> = {
      actorName,
      entityTitle,
      ...((event.metadata ?? {}) as Record<string, string | undefined>),
    };

    return notificationEngine.process(event, recipientIds, vars);
  }

  /**
   * Emit via event bus (for fire-and-forget scenarios).
   */
  emit(event: DomainEvent): void {
    eventSubscriber.emit(event);
  }

  // ─── Event Handlers ─────────────────────────────────────────────────────────

  private async handleAssignment(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    if (!meta.assigneeId) return;
    await this.dispatch(event, [meta.assigneeId as string]);
  }

  private async handleMention(event: DomainEvent): Promise<void> {
    // For mention events triggered via emit(), recipientId is in metadata
    const meta = event.metadata ?? {};
    if (!meta.mentionedUserId) return;
    await this.dispatch(event, [meta.mentionedUserId as string]);
  }

  private async handleComment(event: DomainEvent): Promise<void> {
    // Notify reporter + assignee + reviewer of the work item
    if (event.entityType === "WorkItem") {
      const item = await db.workItem.findUnique({
        where: { id: event.entityId },
        select: { reporterId: true, assigneeId: true, reviewerId: true },
      });
      if (!item) return;
      const recipients = [item.reporterId, item.assigneeId, item.reviewerId].filter(Boolean) as string[];
      await this.dispatch(event, recipients);
    }
  }

  private async handleReply(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    // Notify the parent comment author
    if (meta.parentCommentAuthorId) {
      await this.dispatch(event, [meta.parentCommentAuthorId as string]);
    }
  }

  private async handleStatusChange(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    const recipients: string[] = [];
    if (meta.assigneeId) recipients.push(meta.assigneeId as string);
    if (meta.reporterId) recipients.push(meta.reporterId as string);
    await this.dispatch(event, recipients);
  }

  private async handlePriorityChange(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    const recipients: string[] = [];
    if (meta.assigneeId) recipients.push(meta.assigneeId as string);
    if (meta.reporterId) recipients.push(meta.reporterId as string);
    await this.dispatch(event, recipients);
  }

  private async handleDueDate(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    if (meta.assigneeId) {
      await this.dispatch(event, [meta.assigneeId as string]);
    }
  }

  private async handleBoardUpdate(event: DomainEvent): Promise<void> {
    // Notify board project members (simplified: lookup board members)
    const meta = event.metadata ?? {};
    if (meta.projectId) {
      const members = await db.workspaceMember.findMany({
        where: { workspace: { projects: { some: { id: meta.projectId as string } } } },
        select: { userId: true },
      });
      await this.dispatch(event, members.map((m) => m.userId));
    }
  }

  private async handleProjectUpdate(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    if (meta.workspaceId) {
      const members = await db.workspaceMember.findMany({
        where: { workspaceId: meta.workspaceId as string },
        select: { userId: true },
      });
      await this.dispatch(event, members.map((m) => m.userId));
    }
  }

  private async handleWorkspaceUpdate(event: DomainEvent): Promise<void> {
    const members = await db.workspaceMember.findMany({
      where: { workspaceId: event.entityId },
      select: { userId: true },
    });
    await this.dispatch(event, members.map((m) => m.userId));
  }

  private async handleSystem(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    if (meta.recipientId) {
      await this.dispatch(event, [meta.recipientId as string]);
    }
  }

  private async handleSecurity(event: DomainEvent): Promise<void> {
    const meta = event.metadata ?? {};
    if (meta.recipientId) {
      await this.dispatch(event, [meta.recipientId as string]);
    }
  }

  // ─── Comment Mention Flow ────────────────────────────────────────────────────
  /**
   * Process mentions in a comment. Call this after creating a comment.
   */
  async processMentions(
    content: string,
    commentId: string,
    actorId: string,
    entityId: string,
    entityType: string,
    workspaceId?: string
  ): Promise<void> {
    const mentions = await mentionDetector.detect(content, commentId, actorId, workspaceId);
    for (const mention of mentions) {
      const event: DomainEvent = {
        type: NotificationType.MENTION,
        actorId,
        entityId,
        entityType,
        metadata: {
          mentionedUserId: mention.userId,
          mentionedUserName: `${mention.firstName} ${mention.lastName}`,
        },
      };
      await this.dispatch(event, [mention.userId]);
    }
  }

  // ─── Utility ────────────────────────────────────────────────────────────────
  private async resolveEntityTitle(entityType: string, entityId: string): Promise<string> {
    try {
      switch (entityType) {
        case "WorkItem": {
          const item = await db.workItem.findUnique({ where: { id: entityId }, select: { title: true } });
          return item?.title ?? entityId;
        }
        case "Board": {
          const board = await db.board.findUnique({ where: { id: entityId }, select: { name: true } });
          return board?.name ?? entityId;
        }
        case "Project": {
          const project = await db.project.findUnique({ where: { id: entityId }, select: { name: true } });
          return project?.name ?? entityId;
        }
        case "Workspace": {
          const ws = await db.workspace.findUnique({ where: { id: entityId }, select: { name: true } });
          return ws?.name ?? entityId;
        }
        default:
          return entityId;
      }
    } catch {
      return entityId;
    }
  }
}

export const notificationDispatcher = NotificationDispatcher.getInstance();
