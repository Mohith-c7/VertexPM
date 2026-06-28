import { DomainEvent, BuildNotificationInput, NotificationType } from "../types";
import {
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_DEFAULT_SEVERITY,
  NOTIFICATION_DEFAULT_PRIORITY,
} from "../constants";
import { templateEngine } from "../templates/template.engine";

/**
 * Builds a notification input DTO from a domain event + context variables.
 */
export class NotificationBuilder {
  build(
    event: DomainEvent,
    recipientId: string,
    variables: Record<string, string | undefined>
  ): BuildNotificationInput {
    const type = event.type;
    const { title, body } = templateEngine.render(type, variables);

    return {
      recipientId,
      actorId: event.actorId,
      entityId: event.entityId,
      entityType: event.entityType,
      type,
      category: NOTIFICATION_CATEGORIES[type],
      title,
      body,
      severity: NOTIFICATION_DEFAULT_SEVERITY[type],
      priority: NOTIFICATION_DEFAULT_PRIORITY[type],
      metadata: event.metadata,
    };
  }
}

export const notificationBuilder = new NotificationBuilder();
