'use client';

import React from 'react';
import { formatUnreadCount } from '../../utils';
import styles from './notification-badge.module.css';

interface NotificationBadgeProps {
  count: number;
  animate?: boolean;
  size?: 'sm' | 'md';
}

export function NotificationBadge({
  count,
  animate = false,
  size = 'md',
}: NotificationBadgeProps) {
  if (count === 0) return null;

  return (
    <span
      className={[
        styles.badge,
        size === 'sm' ? styles.sm : styles.md,
        animate ? styles.pulse : '',
      ].join(' ')}
      aria-label={`${count} unread notifications`}
    >
      {formatUnreadCount(count)}
    </span>
  );
}
