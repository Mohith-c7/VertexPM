'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Notification } from '../../types';
import { NotificationCard } from '../notification-card/NotificationCard';
import { formatRelativeTime } from '../../utils';
import { NOTIFICATION_TYPE_CONFIG } from '../../constants';
import styles from './notification-group.module.css';

interface NotificationGroupProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationGroup({
  notifications,
  onMarkRead,
  onArchive,
  onDelete,
}: NotificationGroupProps) {
  const [expanded, setExpanded] = useState(false);

  if (notifications.length === 1) {
    return (
      <NotificationCard
        notification={notifications[0]}
        onMarkRead={onMarkRead}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    );
  }

  const first = notifications[0];
  const config = NOTIFICATION_TYPE_CONFIG[first.type];
  const entityTitle = first.entity?.title || 'an item';
  const actorNames = Array.from(new Set(notifications.map((n) => n.actor?.name).filter(Boolean)));
  const actors = actorNames.slice(0, 2).join(', ');
  const extra = actorNames.length > 2 ? ` +${actorNames.length - 2} more` : '';
  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;

  return (
    <div className={styles.group}>
      {/* Collapsed header */}
      <button
        className={styles.groupHeader}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label={`Group of ${notifications.length} ${config.label} notifications for ${entityTitle}`}
      >
        <span className={styles.groupTypeIcon} style={{ background: config.color }}>
          {/* small icon placeholder */}
          <span className={styles.dot} />
        </span>

        <div className={styles.groupContent}>
          <span className={styles.groupTitle}>
            <strong>{actors}{extra}</strong>{' '}
            {notifications.length > 1
              ? `and ${notifications.length - actorNames.slice(0, 2).length > 0 ? '' : ''}${config.label.toLowerCase()}d on `
              : `${config.label.toLowerCase()}d on `}
            <strong>{entityTitle}</strong>
          </span>
          <span className={styles.groupMeta}>
            {notifications.length} notifications &bull; {formatRelativeTime(first.createdAt)}
          </span>
        </div>

        {unreadCount > 0 && (
          <span className={styles.unreadBadge}>{unreadCount}</span>
        )}

        <span className={styles.chevron}>
          {expanded ? <ChevronDown /> : <ChevronRight />}
        </span>
      </button>

      {/* Expanded list */}
      {expanded && (
        <div className={styles.groupItems}>
          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
