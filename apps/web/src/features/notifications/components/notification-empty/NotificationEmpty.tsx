'use client';

import React from 'react';
import { Bell, Search, Archive, Filter } from 'lucide-react';
import { FilterTab } from '../../types';
import styles from './notification-empty.module.css';

interface NotificationEmptyProps {
  tab: FilterTab;
  hasSearch?: boolean;
  hasFilters?: boolean;
}

const TAB_CONFIG: Record<FilterTab, { icon: React.ReactNode; title: string; desc: string }> = {
  all: {
    icon: <Bell />,
    title: "You're all caught up!",
    desc: 'No notifications here. Check back when there are updates.',
  },
  unread: {
    icon: <Bell />,
    title: 'No unread notifications',
    desc: "Great work! You've read everything.",
  },
  archived: {
    icon: <Archive />,
    title: 'Nothing archived',
    desc: 'Archived notifications will appear here.',
  },
};

export function NotificationEmpty({ tab, hasSearch, hasFilters }: NotificationEmptyProps) {
  if (hasSearch) {
    return (
      <div className={styles.empty}>
        <div className={styles.iconWrapper}>
          <Search />
        </div>
        <h4 className={styles.title}>No results found</h4>
        <p className={styles.desc}>Try different search terms or clear filters.</p>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className={styles.empty}>
        <div className={styles.iconWrapper}>
          <Filter />
        </div>
        <h4 className={styles.title}>No matching notifications</h4>
        <p className={styles.desc}>Try adjusting your filters to see more.</p>
      </div>
    );
  }

  const config = TAB_CONFIG[tab];

  return (
    <div className={styles.empty}>
      <div className={styles.iconWrapper}>{config.icon}</div>
      <h4 className={styles.title}>{config.title}</h4>
      <p className={styles.desc}>{config.desc}</p>
    </div>
  );
}
