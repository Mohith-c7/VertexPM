'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Notification, NotificationFilters } from '../../types';
import { NotificationCenter } from '../notification-center/NotificationCenter';
import { NotificationPreferences } from '../notification-preferences/NotificationPreferences';
import styles from './notification-drawer.module.css';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePanel: 'notifications' | 'preferences';
  setActivePanel: (panel: 'notifications' | 'preferences') => void;
  
  // Notification states and actions passed down
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
}

export function NotificationDrawer({
  isOpen,
  onClose,
  activePanel,
  setActivePanel,
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
}: NotificationDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Handle opening and closing side-effects
  useEffect(() => {
    if (isOpen) {
      // Save previously focused element to return focus later
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
      
      // Auto focus drawer container or first focusable item
      if (drawerRef.current) {
        drawerRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard events (Escape to close, Tab for focus trap)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstEl = focusables[0] as HTMLElement;
        const lastEl = focusables[focusables.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="presentation">
      {/* Backdrop click target */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      
      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label="Notification Center"
      >
        <div className={styles.content}>
          {activePanel === 'notifications' ? (
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              filters={filters}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              error={error}
              onUpdateFilters={onUpdateFilters}
              onLoadMore={onLoadMore}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onArchive={onArchive}
              onDelete={onDelete}
              onOpenPreferences={() => setActivePanel('preferences')}
              onClose={onClose}
            />
          ) : (
            <NotificationPreferences
              onBack={() => setActivePanel('notifications')}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
