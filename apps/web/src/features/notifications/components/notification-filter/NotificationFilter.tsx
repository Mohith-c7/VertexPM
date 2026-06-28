'use client';

import React from 'react';
import { FilterTab, FilterType, NotificationFilters } from '../../types';
import { FILTER_CHIPS } from '../../constants';
import styles from './notification-filter.module.css';

interface NotificationFilterProps {
  filters: NotificationFilters;
  onChange: (updates: Partial<NotificationFilters>) => void;
  unreadCount?: number;
}

export function NotificationFilter({
  filters,
  onChange,
  unreadCount = 0,
}: NotificationFilterProps) {
  const activeTab = filters.tab;
  const activeTypes = filters.types;

  const handleTabChange = (tab: FilterTab) => {
    onChange({ tab });
  };

  const handleChipClick = (type: FilterType) => {
    if (type === 'all') {
      onChange({ types: ['all'] });
      return;
    }

    let updatedTypes = [...activeTypes];
    // Remove 'all' if active
    updatedTypes = updatedTypes.filter((t) => t !== 'all');

    if (updatedTypes.includes(type)) {
      updatedTypes = updatedTypes.filter((t) => t !== type);
      // If empty, revert to 'all'
      if (updatedTypes.length === 0) {
        updatedTypes = ['all'];
      }
    } else {
      updatedTypes.push(type);
    }

    onChange({ types: updatedTypes });
  };

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Notification lists">
        <button
          role="tab"
          aria-selected={activeTab === 'all'}
          onClick={() => handleTabChange('all')}
          className={[styles.tab, activeTab === 'all' ? styles.activeTab : ''].join(' ')}
        >
          All
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'unread'}
          onClick={() => handleTabChange('unread')}
          className={[styles.tab, activeTab === 'unread' ? styles.activeTab : ''].join(' ')}
        >
          Unread
          {unreadCount > 0 && (
            <span className={styles.badge} aria-hidden="true">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'archived'}
          onClick={() => handleTabChange('archived')}
          className={[styles.tab, activeTab === 'archived' ? styles.activeTab : ''].join(' ')}
        >
          Archived
        </button>
      </div>

      {/* Chips */}
      <div className={styles.chipsContainer} aria-label="Filter by type">
        <div className={styles.chipsWrapper}>
          {FILTER_CHIPS.map((chip) => {
            const isActive = activeTypes.includes(chip.type);
            return (
              <button
                key={chip.type}
                onClick={() => handleChipClick(chip.type)}
                className={[styles.chip, isActive ? styles.activeChip : ''].join(' ')}
                aria-pressed={isActive}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
