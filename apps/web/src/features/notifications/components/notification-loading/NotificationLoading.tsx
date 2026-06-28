'use client';

import React from 'react';
import styles from './notification-loading.module.css';

interface NotificationLoadingProps {
  count?: number;
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonLine} style={{ width: '70%' }} />
        <div className={styles.skeletonLine} style={{ width: '90%' }} />
        <div className={styles.skeletonLine} style={{ width: '40%' }} />
      </div>
    </div>
  );
}

export function NotificationLoading({ count = 5 }: NotificationLoadingProps) {
  return (
    <div className={styles.wrapper} role="status" aria-label="Loading notifications">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
