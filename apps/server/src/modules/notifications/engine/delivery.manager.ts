import { BuildNotificationInput } from "../types";
import { notificationRepository } from "../repository/notification.repository";
import { channelDispatcher } from "./channel.dispatcher";
import { realtimeDispatcher } from "../../realtime-sync";
import { db } from "../../../db";
import { SOCKET_EVENTS, GROUPABLE_TYPES, NOTIFICATION_GROUP_WINDOW_MS } from "../constants";
import { notificationLogger } from "../logger";
import { Notification } from "@prisma/client";

const LOG_CTX = "DeliveryManager";

/**
 * Manages the full lifecycle of a notification:
 * 1. Grouping check (dedup within window)
 * 2. Persist to DB
 * 3. Channel dispatch
 * 4. Realtime socket events
 */
export class DeliveryManager {
  async deliver(input: BuildNotificationInput): Promise<Notification | null> {
    // ── Grouping Check ───────────────────────────────────────────────────────
    if (GROUPABLE_TYPES.includes(input.type)) {
      const existing = await notificationRepository.findRecentGroupable({
        type: input.type,
        entityId: input.entityId,
        recipientId: input.recipientId,
        windowMs: NOTIFICATION_GROUP_WINDOW_MS,
      });
      if (existing) {
        notificationLogger.info(LOG_CTX, "Grouped notification suppressed (within window)", {
          type: input.type,
          entityId: input.entityId,
          existingId: existing.id,
        });
        return null; // Grouped – no new notification
      }
    }

    // ── Persist ──────────────────────────────────────────────────────────────
    const notification = await notificationRepository.create(input);
    notificationLogger.info(LOG_CTX, "Notification persisted", { id: notification.id, type: notification.type });

    // ── Fetch recipient User ──────────────────────────────────────────────────
    const recipient = await db.user.findUnique({ where: { id: input.recipientId } });
    if (!recipient) {
      notificationLogger.warn(LOG_CTX, "Recipient not found, skipping channel dispatch", { recipientId: input.recipientId });
      return notification;
    }

    // ── Channel Dispatch ─────────────────────────────────────────────────────
    await channelDispatcher.dispatch(notification, recipient);

    // ── Realtime Events ──────────────────────────────────────────────────────
    this.publishRealtimeEvents(notification, input.recipientId);

    return notification;
  }

  private publishRealtimeEvents(notification: Notification, recipientId: string): void {
    realtimeDispatcher.dispatch({
      event: SOCKET_EVENTS.NOTIFICATION_CREATED,
      entityId: notification.id,
      recipientId,
      actor: notification.actorId ? { id: notification.actorId } : undefined,
      payload: notification,
    });

    // Also publish updated count asynchronously
    notificationRepository.countUnread(recipientId).then((count) => {
      realtimeDispatcher.dispatch({
        event: SOCKET_EVENTS.NOTIFICATION_COUNT_UPDATED,
        entityId: recipientId,
        recipientId,
        payload: { recipientId, unreadCount: count },
      });
    }).catch((err) => {
      notificationLogger.error(LOG_CTX, "Failed to publish count update", { error: String(err) });
    });
  }

}

export const deliveryManager = new DeliveryManager();
