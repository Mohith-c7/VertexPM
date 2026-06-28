'use client';

import React, { useEffect, useRef } from 'react';
import { Notification } from '../../types';
import { NotificationGroup } from '../notification-group/NotificationGroup';
import { groupNotifications } from '../../utils';
import { NotificationLoading } from '../notification-loading/NotificationLoading';
import styles from './notification-list.module.css';

interface NotificationListProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  newNotificationIds?: Set<string>;
}

export function NotificationList({
  notifications,
  onMarkRead,
  onArchive,
  onDelete,
  hasMore,
  isLoadingMore,
  onLoadMore,
  newNotificationIds = new Set(),
}: NotificationListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  const groups = groupNotifications(notifications);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.list}>
        {groups.map((group) => (
          <NotificationGroup
            key={group.key}
            notifications={group.notifications}
            onMarkRead={onMarkRead}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true">
        {isLoadingMore && <NotificationLoading count={2} />}
      </div>
    </div>
  );
}
