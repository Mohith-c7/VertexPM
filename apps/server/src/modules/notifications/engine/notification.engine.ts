import { DomainEvent, BuildNotificationInput } from "../types";
import { recipientResolver } from "../dispatcher/recipient.resolver";
import { notificationBuilder } from "../dispatcher/notification.builder";
import { deliveryManager } from "./delivery.manager";
import { db } from "../../../db";
import { notificationLogger } from "../logger";
import { Notification } from "@prisma/client";

const LOG_CTX = "NotificationEngine";

/**
 * Core orchestration engine.
 * Called by the NotificationDispatcher to:
 * 1. Resolve recipients
 * 2. Build per-recipient notification inputs
 * 3. Deliver via DeliveryManager
 */
export class NotificationEngine {
  /**
   * Process a domain event: resolve recipients → build → deliver.
   * @param event              Domain event
   * @param recipientIds       Explicit list of recipient user IDs
   * @param templateVariables  Variables for template interpolation
   */
  async process(
    event: DomainEvent,
    recipientIds: string[],
    templateVariables: Record<string, string | undefined>
  ): Promise<Notification[]> {
    const recipients = await recipientResolver.resolve(event, recipientIds);

    if (recipients.length === 0) {
      notificationLogger.info(LOG_CTX, "No recipients to notify", { type: event.type });
      return [];
    }

    const results: Notification[] = [];

    for (const recipient of recipients) {
      // Merge recipient name into template variables
      const vars = {
        ...templateVariables,
        recipientName: `${recipient.firstName} ${recipient.lastName}`,
      };

      const input: BuildNotificationInput = notificationBuilder.build(event, recipient.id, vars);

      try {
        const notification = await deliveryManager.deliver(input);
        if (notification) results.push(notification);
      } catch (err) {
        notificationLogger.error(LOG_CTX, "Delivery failed for recipient", {
          recipientId: recipient.id,
          error: String(err),
        });
      }
    }

    notificationLogger.info(LOG_CTX, `Delivered ${results.length}/${recipients.length} notifications`, {
      type: event.type,
    });

    return results;
  }

  /** Fetch actor display name for template variables */
  async getActorName(actorId?: string): Promise<string> {
    if (!actorId) return "System";
    const actor = await db.user.findUnique({
      where: { id: actorId },
      select: { firstName: true, lastName: true },
    });
    return actor ? `${actor.firstName} ${actor.lastName}` : "Someone";
  }
}

export const notificationEngine = new NotificationEngine();
