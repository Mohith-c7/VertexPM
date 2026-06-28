import {
  NotificationType,
  NotificationSeverity,
  NotificationPriority,
  Notification,
  NotificationPreference,
  User,
} from "@prisma/client";

// Re-export Prisma enums for convenience
export { NotificationType, NotificationSeverity, NotificationPriority };
export type { Notification, NotificationPreference, User };

// ─── Domain Event Types ────────────────────────────────────────────────────────
export interface DomainEvent {
  type: NotificationType;
  actorId?: string;
  entityId: string;
  entityType: string;
  workspaceId?: string;
  projectId?: string;
  boardId?: string;
  metadata?: Record<string, any>;
}

export interface AssignmentEvent extends DomainEvent {
  type: "ASSIGNMENT";
  assigneeId: string;
}

export interface MentionEvent extends DomainEvent {
  type: "MENTION";
  mentionedUserId: string;
  commentContent: string;
}

export interface CommentEvent extends DomainEvent {
  type: "COMMENT" | "REPLY";
  workItemId: string;
  commentContent?: string;
  parentCommentId?: string;
}

export interface StatusChangeEvent extends DomainEvent {
  type: "STATUS_CHANGE";
  oldValue: string;
  newValue: string;
  assigneeId?: string;
}

export interface PriorityChangeEvent extends DomainEvent {
  type: "PRIORITY_CHANGE";
  oldValue: string;
  newValue: string;
  assigneeId?: string;
}

export interface DueDateEvent extends DomainEvent {
  type: "DUE_DATE";
  dueDate: string;
  assigneeId?: string;
}



// ─── Notification Builder Input ────────────────────────────────────────────────
export interface BuildNotificationInput {
  recipientId: string;
  actorId?: string;
  entityId: string;
  entityType: string;
  type: NotificationType;
  category: string;
  title: string;
  body: string;
  severity?: NotificationSeverity;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

// ─── Browser Push Notification DTO ────────────────────────────────────────────
export interface BrowserNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag: string;
  url?: string;
  timestamp: string;
  priority: NotificationPriority;
  data: {
    entityType: string;
    entityId: string;
    notificationId: string;
  };
}

// ─── Notification Group Key ────────────────────────────────────────────────────
export interface NotificationGroupKey {
  type: NotificationType;
  entityId: string;
  recipientId: string;
}

// ─── Channel Types ────────────────────────────────────────────────────────────
export type ChannelName = "IN_APP" | "BROWSER";

export interface QuietHours {
  enabled: boolean;
  startHour: number; // 0-23
  endHour: number;   // 0-23
  timezone?: string;
}

export interface ParsedPreferences {
  types: NotificationType[];
  channels: ChannelName[];
  quietHours?: QuietHours;
  digestFreq?: string;
}
