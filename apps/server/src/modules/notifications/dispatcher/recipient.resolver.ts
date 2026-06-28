import { db } from "../../../db";
import { DomainEvent } from "../types";
import { notificationLogger } from "../logger";

const LOG_CTX = "RecipientResolver";

export interface ResolvedRecipient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Resolves recipient user IDs from a domain event context.
 * Different event types have different recipient resolution strategies.
 */
export class RecipientResolver {
  /**
   * Resolve the list of recipients for a given domain event.
   * Returns a deduplicated list, excluding the actor themselves.
   */
  async resolve(event: DomainEvent, explicitRecipientIds: string[]): Promise<ResolvedRecipient[]> {
    const ids = new Set(explicitRecipientIds);

    // Remove actor from recipients
    if (event.actorId) ids.delete(event.actorId);

    if (ids.size === 0) return [];

    const users = await db.user.findMany({
      where: {
        id: { in: Array.from(ids) },
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    notificationLogger.debug(LOG_CTX, `Resolved ${users.length} recipient(s)`, { type: event.type });
    return users;
  }

  /** Resolve watchers of a work item (reporter + assignee + reviewer) */
  async resolveWorkItemWatchers(workItemId: string, excludeId?: string): Promise<ResolvedRecipient[]> {
    const item = await db.workItem.findUnique({
      where: { id: workItemId },
      select: {
        reporterId: true,
        assigneeId: true,
        reviewerId: true,
      },
    });
    if (!item) return [];

    const ids = new Set<string>();
    if (item.reporterId) ids.add(item.reporterId);
    if (item.assigneeId) ids.add(item.assigneeId);
    if (item.reviewerId) ids.add(item.reviewerId);
    if (excludeId) ids.delete(excludeId);

    return this.resolve({ type: "COMMENT" as any, entityId: workItemId, entityType: "WorkItem" }, Array.from(ids));
  }
}

export const recipientResolver = new RecipientResolver();
