'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  archiveNotification,
  deleteNotification,
} from '../services/notification.service';
import { Notification, NotificationFilters, FilterTab, FilterType } from '../types';
import { NOTIFICATIONS_PAGE_SIZE } from '../constants';

const DEFAULT_FILTERS: NotificationFilters = {
  tab: 'all',
  types: ['all'],
  search: '',
};

function tabToStatus(tab: FilterTab): 'all' | 'UNREAD' | 'ARCHIVED' {
  if (tab === 'unread') return 'UNREAD';
  if (tab === 'archived') return 'ARCHIVED';
  return 'all';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState<NotificationFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const loadNotifications = useCallback(
    async (reset = false) => {
      const currentFilters = filtersRef.current;
      const currentPage = reset ? 1 : page;

      if (reset) {
        setIsLoading(true);
        setPage(1);
      } else {
        setIsLoadingMore(true);
      }

      setError(null);
      try {
        const status = tabToStatus(currentFilters.tab);
        const types =
          currentFilters.types.includes('all')
            ? undefined
            : (currentFilters.types.filter((t) => t !== 'all') as string[]);

        const result = await fetchNotifications({
          page: currentPage,
          limit: NOTIFICATIONS_PAGE_SIZE,
          status,
          types,
          search: currentFilters.search || undefined,
        });

        setNotifications((prev) =>
          reset ? result.data : [...prev, ...result.data]
        );
        setHasMore(result.meta.hasMore);
        if (!reset) setPage((p) => p + 1);
      } catch (e) {
        setError('Failed to load notifications');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [page]
  );

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    } catch {
      // silent
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotifications(true);
    loadUnreadCount();
  }, [filters]);

  // Reload on filter change
  const updateFilters = useCallback((updates: Partial<NotificationFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadNotifications(false);
    }
  }, [isLoadingMore, hasMore, loadNotifications]);

  // Mark single notification read
  const markRead = useCallback(async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'READ', readAt: new Date().toISOString() } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationRead(id);
    } catch {
      // revert on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'UNREAD', readAt: null } : n))
      );
      setUnreadCount((c) => c + 1);
    }
  }, []);

  // Mark all read
  const markAllRead = useCallback(async () => {
    const prevNotifications = notifications;
    const prevCount = unreadCount;
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: 'READ' as const, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      setNotifications(prevNotifications);
      setUnreadCount(prevCount);
    }
  }, [notifications, unreadCount]);

  // Archive
  const archive = useCallback(async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await archiveNotification(id);
    } catch {
      loadNotifications(true);
    }
  }, [loadNotifications]);

  // Delete
  const remove = useCallback(async (id: string) => {
    const waUnread = notifications.find((n) => n.id === id)?.status === 'UNREAD';
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (waUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await deleteNotification(id);
    } catch {
      loadNotifications(true);
    }
  }, [notifications, loadNotifications]);

  // Add new notification from socket
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (notification.status === 'UNREAD') {
      setUnreadCount((c) => c + 1);
    }
  }, []);

  const refreshUnreadCount = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  return {
    notifications,
    unreadCount,
    filters,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    updateFilters,
    loadMore,
    markRead,
    markAllRead,
    archive,
    remove,
    addNotification,
    refreshUnreadCount,
    reload: () => loadNotifications(true),
  };
}
