import { formatDistanceToNow, isYesterday, isToday, format } from 'date-fns';
import { Notification } from '../types';

// ─── Time Formatting ──────────────────────────────────────────────────────────

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMM d');
}

// ─── Notification Grouping ────────────────────────────────────────────────────

export function groupNotifications(
  notifications: Notification[]
): Array<{ key: string; notifications: Notification[]; isGroup: boolean }> {
  const groups: Map<string, Notification[]> = new Map();
  const order: string[] = [];

  for (const n of notifications) {
    const entityId = n.entity?.id || 'standalone';
    const groupKey = `${n.type}::${entityId}`;
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
      order.push(groupKey);
    }
    groups.get(groupKey)!.push(n);
  }

  return order.map((key) => {
    const group = groups.get(key)!;
    return {
      key,
      notifications: group,
      isGroup: group.length > 1,
    };
  });
}

// ─── Entity URL Helpers ───────────────────────────────────────────────────────

export function getEntityUrl(notification: Notification): string {
  if (notification.entity?.url) return notification.entity.url;
  const entityId = notification.entity?.id;
  const entityType = notification.entity?.type;
  if (!entityId || !entityType) return '#';
  
  switch (entityType.toLowerCase()) {
    case 'task':
    case 'workitem':
      return `/dashboard`;
    case 'project':
      return `/dashboard`;
    default:
      return '#';
  }
}

// ─── Avatar Initials ──────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Avatar Color ─────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#0ea5e9', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#06b6d4',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Unread Count Display ─────────────────────────────────────────────────────

export function formatUnreadCount(count: number): string {
  if (count > 99) return '99+';
  return count.toString();
}
