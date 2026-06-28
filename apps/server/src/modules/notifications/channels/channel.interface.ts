import { Notification, User } from "@prisma/client";
import { NotificationType } from "../types";

/**
 * Interface that every notification channel MUST implement.
 */
export interface INotificationChannel {
  /** Channel identifier, e.g. "IN_APP", "BROWSER" */
  readonly name: string;

  /**
   * Send (or queue) a notification to the given recipient.
   * For in-app this stores to DB; for browser this publishes a socket payload.
   */
  send(notification: Notification, recipient: User): Promise<void>;

  /** Returns true if this channel handles the given notification type. */
  supports(type: NotificationType): boolean;
}
