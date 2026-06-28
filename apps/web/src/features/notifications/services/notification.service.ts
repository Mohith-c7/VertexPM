import api from '@/services/api';
import {
  PaginatedNotifications,
  UnreadCountResponse,
  Notification,
  NotificationPreferences,
} from '../types';

const BASE = '/notifications';

// ─── Fetch Notifications ──────────────────────────────────────────────────────

export interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  status?: 'UNREAD' | 'READ' | 'ARCHIVED' | 'all';
  types?: string[];
  search?: string;
}

export async function fetchNotifications(
  params: FetchNotificationsParams = {}
): Promise<PaginatedNotifications> {
  const { page = 1, limit = 20, status, types, search } = params;
  const qp = new URLSearchParams();
  qp.set('page', String(page));
  qp.set('limit', String(limit));
  if (status && status !== 'all') qp.set('status', status);
  if (types && types.length > 0) qp.set('types', types.join(','));
  if (search) qp.set('search', search);

  const { data } = await api.get<PaginatedNotifications>(`${BASE}?${qp.toString()}`);
  return data;
}

// ─── Unread Count ─────────────────────────────────────────────────────────────

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await api.get<UnreadCountResponse>(`${BASE}/unread-count`);
  return data.count;
}

// ─── Mark Read ────────────────────────────────────────────────────────────────

export async function markNotificationRead(id: string): Promise<Notification> {
  const { data } = await api.patch<Notification>(`${BASE}/${id}/read`);
  return data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch(`${BASE}/read-all`);
}

// ─── Archive ──────────────────────────────────────────────────────────────────

export async function archiveNotification(id: string): Promise<Notification> {
  const { data } = await api.patch<Notification>(`${BASE}/${id}/archive`);
  return data;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const { data } = await api.get<NotificationPreferences>(`${BASE}/preferences`);
  return data;
}

export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> {
  const { data } = await api.patch<NotificationPreferences>(
    `${BASE}/preferences`,
    preferences
  );
  return data;
}
