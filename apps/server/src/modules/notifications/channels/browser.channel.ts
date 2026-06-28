import { Notification, User } from "@prisma/client";
import { INotificationChannel } from "./channel.interface";
import { NotificationType, BrowserNotificationPayload } from "../types";
import { realtimeDispatcher } from "../../realtime-sync";
import { notificationLogger } from "../logger";

const LOG_CTX = "BrowserChannel";

/**
 * Browser Push channel.
 * The frontend handles actual delivery via Service Worker.
 * This channel publishes the payload over WebSocket for the client to pick up.
 */
export class BrowserChannel implements INotificationChannel {
  readonly name = "BROWSER";

  /** All types are potentially browser-pushable */
  supports(_type: NotificationType): boolean {
    return true;
  }

  async send(notification: Notification, recipient: User): Promise<void> {
    const payload: BrowserNotificationPayload = {
      title: notification.title,
      body: notification.body,
      icon: "/favicon.ico",
      tag: `${notification.type}-${notification.entityId}`,
      url: this.buildUrl(notification),
      timestamp: notification.createdAt.toISOString(),
      priority: notification.priority,
      data: {
        entityType: notification.entityType,
        entityId: notification.entityId,
        notificationId: notification.id,
      },
    };

    notificationLogger.info(LOG_CTX, "Emitting browser push payload via socket", {
      notificationId: notification.id,
      recipientId: recipient.id,
    });

    // Emit to user-specific socket room if available, otherwise broadcast event
    realtimeDispatcher.dispatch({
      event: "notification.browser_push",
      entityId: notification.id,
      recipientId: recipient.id,
      actor: { id: recipient.id },
      payload,
    });

  }

  private buildUrl(notification: Notification): string {
    switch (notification.entityType) {
      case "WorkItem":
        return `/work-items/${notification.entityId}`;
      case "Comment":
        return `/comments/${notification.entityId}`;
      case "Board":
        return `/boards/${notification.entityId}`;
      case "Project":
        return `/projects/${notification.entityId}`;
      case "Workspace":
        return `/workspaces/${notification.entityId}`;
      default:
        return "/notifications";
    }
  }
}

export const browserChannel = new BrowserChannel();
