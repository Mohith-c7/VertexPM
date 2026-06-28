'use client';

import React, { useRef } from 'react';
import { Bell } from 'lucide-react';
import { NotificationBadge } from '../notification-badge/NotificationBadge';
import styles from './notification-bell.module.css';

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  hasNew?: boolean;
}

export function NotificationBell({ unreadCount, onClick, hasNew = false }: NotificationBellProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={[styles.bell, hasNew ? styles.hasNew : ''].join(' ')}
      aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      aria-haspopup="dialog"
    >
      <Bell
        className={[styles.icon, hasNew ? styles.ringAnimation : ''].join(' ')}
        aria-hidden="true"
      />
      {unreadCount > 0 && (
        <span className={styles.badgeWrapper}>
          <NotificationBadge count={unreadCount} animate={hasNew} size="sm" />
        </span>
      )}
      {hasNew && <span className={styles.ripple} />}
    </button>
  );
}
