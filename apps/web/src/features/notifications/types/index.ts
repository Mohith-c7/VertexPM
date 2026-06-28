// ─── Notification Types ─────────────────────────────────────────────────────

export type NotificationType =
  | 'ASSIGNMENT'
  | 'MENTION'
  | 'COMMENT'
  | 'REPLY'
  | 'STATUS_CHANGE'
  | 'PRIORITY_CHANGE'
  | 'DUE_DATE'
  | 'REMINDER'
  | 'SYSTEM';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED';

export type NotificationChannel = 'IN_APP' | 'BROWSER' | 'EMAIL';

export type FilterTab = 'all' | 'unread' | 'archived';

export type FilterType = NotificationType | 'all';

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface NotificationActor {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface NotificationEntity {
  id: string;
  type: string; // 'task', 'project', 'comment', etc.
  title: string;
  url?: string;
  workspaceSlug?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  body: string;
  actor?: NotificationActor;
  entity?: NotificationEntity;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string | null;
  archivedAt?: string | null;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginatedNotifications {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface UnreadCountResponse {
  count: number;
}

// ─── Preferences Types ────────────────────────────────────────────────────────

export interface NotificationTypePreference {
  type: NotificationType;
  enabled: boolean;
  channels: NotificationChannel[];
}

export interface QuietHours {
  enabled: boolean;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  timezone?: string;
}

export interface WorkspaceNotificationPreferences {
  workspaceId: string;
  enabled: boolean;
  types: NotificationTypePreference[];
}

export interface NotificationPreferences {
  id?: string;
  userId?: string;
  inAppEnabled: boolean;
  browserEnabled: boolean;
  emailEnabled: boolean;
  quietHours: QuietHours;
  types: NotificationTypePreference[];
  workspacePreferences?: WorkspaceNotificationPreferences[];
}

// ─── UI State Types ───────────────────────────────────────────────────────────

export interface NotificationGroup {
  id: string;
  type: NotificationType;
  entityId: string;
  entityTitle: string;
  notifications: Notification[];
  isExpanded: boolean;
  latestAt: string;
}

export interface NotificationFilters {
  tab: FilterTab;
  types: FilterType[];
  search: string;
}

// ─── Socket Event Types ───────────────────────────────────────────────────────

export interface NotificationCreatedEvent {
  notification: Notification;
}

export interface NotificationReadEvent {
  notificationId: string;
}

export interface NotificationCountUpdatedEvent {
  count: number;
}
