import { NotificationType } from "../types";

/**
 * Template registry maps notification types to title/body templates.
 * Templates support simple `{{variable}}` interpolation.
 */

export interface NotificationTemplate {
  title: string;
  body: string;
}

const templates: Record<NotificationType, NotificationTemplate> = {
  [NotificationType.ASSIGNMENT]: {
    title: "Assigned to you",
    body: "{{actorName}} assigned {{entityTitle}} to you",
  },
  [NotificationType.MENTION]: {
    title: "You were mentioned",
    body: "{{actorName}} mentioned you in a comment on {{entityTitle}}",
  },
  [NotificationType.COMMENT]: {
    title: "New comment",
    body: "{{actorName}} commented on {{entityTitle}}",
  },
  [NotificationType.REPLY]: {
    title: "New reply",
    body: "{{actorName}} replied to your comment on {{entityTitle}}",
  },
  [NotificationType.STATUS_CHANGE]: {
    title: "Status updated",
    body: "{{actorName}} changed the status of {{entityTitle}} from {{oldValue}} to {{newValue}}",
  },
  [NotificationType.PRIORITY_CHANGE]: {
    title: "Priority changed",
    body: "{{actorName}} changed the priority of {{entityTitle}} from {{oldValue}} to {{newValue}}",
  },
  [NotificationType.DUE_DATE]: {
    title: "Due date reminder",
    body: "{{entityTitle}} is due on {{dueDate}}",
  },
  [NotificationType.REMINDER]: {
    title: "Reminder",
    body: "Reminder: {{entityTitle}} — {{message}}",
  },
  [NotificationType.BOARD_UPDATE]: {
    title: "Board updated",
    body: "{{actorName}} updated board {{entityTitle}}",
  },
  [NotificationType.PROJECT_UPDATE]: {
    title: "Project updated",
    body: "{{actorName}} updated project {{entityTitle}}",
  },
  [NotificationType.WORKSPACE_UPDATE]: {
    title: "Workspace updated",
    body: "{{actorName}} updated workspace {{entityTitle}}",
  },
  [NotificationType.SYSTEM]: {
    title: "System notification",
    body: "{{message}}",
  },
  [NotificationType.AI]: {
    title: "AI update",
    body: "{{message}}",
  },
  [NotificationType.AUTOMATION]: {
    title: "Automation triggered",
    body: "Automation rule {{entityTitle}} executed: {{message}}",
  },
  [NotificationType.SECURITY]: {
    title: "Security alert",
    body: "{{message}}",
  },
};

export class TemplateRegistry {
  get(type: NotificationType): NotificationTemplate | undefined {
    return templates[type];
  }

  getAll(): Record<NotificationType, NotificationTemplate> {
    return templates;
  }
}

export const templateRegistry = new TemplateRegistry();
