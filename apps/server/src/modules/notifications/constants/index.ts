import { NotificationType, NotificationSeverity, NotificationPriority, ChannelName } from "../types";

// ─── Notification Type → Category Mapping ─────────────────────────────────────
export const NOTIFICATION_CATEGORIES: Record<NotificationType, string> = {
  [NotificationType.ASSIGNMENT]: "work",
  [NotificationType.MENTION]: "social",
  [NotificationType.COMMENT]: "social",
  [NotificationType.REPLY]: "social",
  [NotificationType.STATUS_CHANGE]: "work",
  [NotificationType.PRIORITY_CHANGE]: "work",
  [NotificationType.DUE_DATE]: "reminder",
  [NotificationType.REMINDER]: "reminder",
  [NotificationType.BOARD_UPDATE]: "system",
  [NotificationType.PROJECT_UPDATE]: "system",
  [NotificationType.WORKSPACE_UPDATE]: "system",
  [NotificationType.SYSTEM]: "system",
  [NotificationType.AI]: "ai",
  [NotificationType.AUTOMATION]: "automation",
  [NotificationType.SECURITY]: "security",
};

// ─── Default Severity per Type ────────────────────────────────────────────────
export const NOTIFICATION_DEFAULT_SEVERITY: Record<NotificationType, NotificationSeverity> = {
  [NotificationType.ASSIGNMENT]: NotificationSeverity.INFO,
  [NotificationType.MENTION]: NotificationSeverity.INFO,
  [NotificationType.COMMENT]: NotificationSeverity.INFO,
  [NotificationType.REPLY]: NotificationSeverity.INFO,
  [NotificationType.STATUS_CHANGE]: NotificationSeverity.INFO,
  [NotificationType.PRIORITY_CHANGE]: NotificationSeverity.WARNING,
  [NotificationType.DUE_DATE]: NotificationSeverity.WARNING,
  [NotificationType.REMINDER]: NotificationSeverity.INFO,
  [NotificationType.BOARD_UPDATE]: NotificationSeverity.INFO,
  [NotificationType.PROJECT_UPDATE]: NotificationSeverity.INFO,
  [NotificationType.WORKSPACE_UPDATE]: NotificationSeverity.INFO,
  [NotificationType.SYSTEM]: NotificationSeverity.INFO,
  [NotificationType.AI]: NotificationSeverity.INFO,
  [NotificationType.AUTOMATION]: NotificationSeverity.INFO,
  [NotificationType.SECURITY]: NotificationSeverity.CRITICAL,
};

// ─── Default Priority per Type ────────────────────────────────────────────────
export const NOTIFICATION_DEFAULT_PRIORITY: Record<NotificationType, NotificationPriority> = {
  [NotificationType.ASSIGNMENT]: NotificationPriority.NORMAL,
  [NotificationType.MENTION]: NotificationPriority.HIGH,
  [NotificationType.COMMENT]: NotificationPriority.NORMAL,
  [NotificationType.REPLY]: NotificationPriority.NORMAL,
  [NotificationType.STATUS_CHANGE]: NotificationPriority.NORMAL,
  [NotificationType.PRIORITY_CHANGE]: NotificationPriority.HIGH,
  [NotificationType.DUE_DATE]: NotificationPriority.HIGH,
  [NotificationType.REMINDER]: NotificationPriority.NORMAL,
  [NotificationType.BOARD_UPDATE]: NotificationPriority.LOW,
  [NotificationType.PROJECT_UPDATE]: NotificationPriority.LOW,
  [NotificationType.WORKSPACE_UPDATE]: NotificationPriority.LOW,
  [NotificationType.SYSTEM]: NotificationPriority.NORMAL,
  [NotificationType.AI]: NotificationPriority.LOW,
  [NotificationType.AUTOMATION]: NotificationPriority.NORMAL,
  [NotificationType.SECURITY]: NotificationPriority.URGENT,
};

// ─── Grouping Window (ms) ─────────────────────────────────────────────────────
export const NOTIFICATION_GROUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// ─── Groupable notification types ─────────────────────────────────────────────
export const GROUPABLE_TYPES: NotificationType[] = [
  NotificationType.COMMENT,
  NotificationType.MENTION,
  NotificationType.REPLY,
  NotificationType.STATUS_CHANGE,
  NotificationType.PRIORITY_CHANGE,
  NotificationType.BOARD_UPDATE,
];

// ─── Socket event names ────────────────────────────────────────────────────────
export const SOCKET_EVENTS = {
  NOTIFICATION_CREATED: "notification.created",
  NOTIFICATION_READ: "notification.read",
  NOTIFICATION_ARCHIVED: "notification.archived",
  NOTIFICATION_COUNT_UPDATED: "notification.count_updated",
} as const;

// ─── Channels ──────────────────────────────────────────────────────────────────
export const DEFAULT_CHANNELS: ChannelName[] = ["IN_APP"];

export const ALL_CHANNELS: ChannelName[] = ["IN_APP", "BROWSER"];

// ─── Pagination Defaults ───────────────────────────────────────────────────────
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// ─── Mention Regex ─────────────────────────────────────────────────────────────
export const MENTION_REGEX = /@([a-zA-Z0-9._-]+)/g;
