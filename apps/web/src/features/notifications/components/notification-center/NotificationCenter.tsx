'use client';

import React from 'react';
import { Settings, CheckSquare, X } from 'lucide-react';
import { Notification, NotificationFilters, FilterTab, FilterType } from '../../types';
import { NotificationSearch } from '../notification-search/NotificationSearch';
import { NotificationFilter } from '../notification-filter/NotificationFilter';
import { NotificationList } from '../notification-list/NotificationList';
import { NotificationEmpty } from '../notification-empty/NotificationEmpty';
import { NotificationLoading } from '../notification-loading/NotificationLoading';
import styles from './notification-center.module.css';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  filters: NotificationFilters;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onUpdateFilters: (updates: Partial<NotificationFilters>) => void;
  onLoadMore: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenPreferences: () => void;
  onClose?: () => void;
  newNotificationIds?: Set<string>;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  filters,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onUpdateFilters,
  onLoadMore,
  onMarkRead,
  onMarkAllRead,
  onArchive,
  onDelete,
  onOpenPreferences,
  onClose,
  newNotificationIds = new Set(),
}: NotificationCenterProps) {
  const hasSearch = !!filters.search;
  const hasTypeFilters = filters.types.length > 0 && !filters.types.includes('all');

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Notifications</h3>
        <div className={styles.actions}>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className={styles.headerBtn}
              title="Mark all read"
              aria-label="Mark all notifications as read"
            >
              <CheckSquare className={styles.btnIcon} />
              <span className={styles.btnText}>Mark all read</span>
            </button>
          )}
          <button
            onClick={onOpenPreferences}
            className={styles.headerBtn}
            title="Notification preferences"
            aria-label="Open notification preferences"
          >
            <Settings className={styles.btnIcon} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className={styles.headerBtn}
              title="Close panel"
              aria-label="Close notifications panel"
            >
              <X className={styles.btnIcon} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <NotificationSearch
        value={filters.search}
        onChange={(search) => onUpdateFilters({ search })}
      />

      {/* Filters (Tabs + Chips) */}
      <NotificationFilter
        filters={filters}
        onChange={onUpdateFilters}
        unreadCount={unreadCount}
      />

      {/* List / Loading / Empty Content */}
      <div className={styles.contentArea}>
        {isLoading && notifications.length === 0 ? (
          <NotificationLoading count={5} />
        ) : error ? (
          <div className={styles.errorState} role="alert">
            <p>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmpty
            tab={filters.tab}
            hasSearch={hasSearch}
            hasFilters={hasTypeFilters}
          />
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkRead={onMarkRead}
            onArchive={onArchive}
            onDelete={onDelete}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={onLoadMore}
            newNotificationIds={newNotificationIds}
          />
        )}
      </div>
    </div>
  );
}
