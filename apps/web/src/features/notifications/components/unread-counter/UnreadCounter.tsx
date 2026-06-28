'use client';

import React from 'react';
import { formatUnreadCount } from '../../utils';
import styles from './unread-counter.module.css';

interface UnreadCounterProps {
  count: number;
  className?: string;
}

export function UnreadCounter({ count, className = '' }: UnreadCounterProps) {
  if (count <= 0) return null;

  return (
    <span
      className={[styles.counter, className].join(' ')}
      aria-label={`${count} unread notifications`}
    >
      {formatUnreadCount(count)}
    </span>
  );
}
