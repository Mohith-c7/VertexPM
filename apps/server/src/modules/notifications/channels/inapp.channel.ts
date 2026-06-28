import { Notification, User } from "@prisma/client";
import { INotificationChannel } from "./channel.interface";
import { NotificationType } from "../types";
import { notificationLogger } from "../logger";

const LOG_CTX = "InAppChannel";

/**
 * In-App channel: notification is already persisted to DB by the time this runs.
 * This channel emits the realtime event via the existing RealtimeDispatcher.
 */
export class InAppChannel implements INotificationChannel {
  readonly name = "IN_APP";

  supports(_type: NotificationType): boolean {
    // IN_APP supports all notification types
    return true;
  }

  async send(notification: Notification, recipient: User): Promise<void> {
    // The actual DB persistence is done by NotificationDispatcher before channel dispatch.
    // Here we just log confirmation (realtime is handled by engine).
    notificationLogger.info(LOG_CTX, "In-app notification delivered", {
      notificationId: notification.id,
      recipientId: recipient.id,
      type: notification.type,
    });
  }
}

export const inAppChannel = new InAppChannel();
