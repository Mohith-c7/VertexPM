import { NotificationType, FilterType } from '../types';

// ─── Notification Type Metadata ───────────────────────────────────────────────

export const NOTIFICATION_TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  ASSIGNMENT: {
    label: 'Assignment',
    icon: 'user-check',
    color: '#6366f1',
    bgColor: '#eef2ff',
  },
  MENTION: {
    label: 'Mention',
    icon: 'at-sign',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  COMMENT: {
    label: 'Comment',
    icon: 'message-circle',
    color: '#0ea5e9',
    bgColor: '#f0f9ff',
  },
  REPLY: {
    label: 'Reply',
    icon: 'corner-down-right',
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
  STATUS_CHANGE: {
    label: 'Status Change',
    icon: 'refresh-cw',
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  PRIORITY_CHANGE: {
    label: 'Priority Change',
    icon: 'alert-triangle',
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  DUE_DATE: {
    label: 'Due Date',
    icon: 'calendar',
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  REMINDER: {
    label: 'Reminder',
    icon: 'bell',
    color: '#f97316',
    bgColor: '#fff7ed',
  },
  SYSTEM: {
    label: 'System',
    icon: 'info',
    color: '#64748b',
    bgColor: '#f8fafc',
  },
};

// ─── Filter Chip Definitions ──────────────────────────────────────────────────

export const FILTER_CHIPS: { type: FilterType; label: string }[] = [
  { type: 'all', label: 'All Types' },
  { type: 'ASSIGNMENT', label: 'Assignments' },
  { type: 'MENTION', label: 'Mentions' },
  { type: 'COMMENT', label: 'Comments' },
  { type: 'REPLY', label: 'Replies' },
  { type: 'STATUS_CHANGE', label: 'Status' },
  { type: 'PRIORITY_CHANGE', label: 'Priority' },
  { type: 'DUE_DATE', label: 'Due Dates' },
  { type: 'REMINDER', label: 'Reminders' },
  { type: 'SYSTEM', label: 'System' },
];

// ─── Priority Config ──────────────────────────────────────────────────────────

export const PRIORITY_CONFIG = {
  LOW: { label: 'Low', color: '#94a3b8' },
  NORMAL: { label: 'Normal', color: '#64748b' },
  HIGH: { label: 'High', color: '#f59e0b' },
  URGENT: { label: 'Urgent', color: '#ef4444' },
};

// ─── Pagination ───────────────────────────────────────────────────────────────

export const NOTIFICATIONS_PAGE_SIZE = 20;

// ─── Socket Events ────────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_READ: 'notification.read',
  COUNT_UPDATED: 'notification.count_updated',
} as const;
