'use client';

import React from 'react';
import { Bell, Info } from 'lucide-react';
import { useBrowserNotifications } from '../../hooks/use-browser-notifications';
import styles from './browser-permission.module.css';

interface BrowserPermissionProps {
  onPermissionChange?: (granted: boolean) => void;
}

export function BrowserPermission({ onPermissionChange }: BrowserPermissionProps) {
  const { permissionState, requestPermission, isGranted, isSupported } = useBrowserNotifications();

  if (!isSupported) {
    return (
      <div className={styles.container}>
        <div className={styles.infoWrapper}>
          <Info className={styles.infoIcon} />
          <p className={styles.text}>
            Browser notifications are not supported in your browser.
          </p>
        </div>
      </div>
    );
  }

  if (isGranted) {
    return (
      <div className={[styles.container, styles.granted].join(' ')}>
        <div className={styles.iconWrapper}>
          <Bell className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h4 className={styles.title}>Notifications enabled</h4>
          <p className={styles.desc}>
            You will receive real-time notifications on your desktop.
          </p>
        </div>
      </div>
    );
  }

  const handleEnable = async () => {
    const success = await requestPermission();
    if (onPermissionChange) {
      onPermissionChange(success);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Bell className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>Enable desktop notifications</h4>
        <p className={styles.desc}>
          Get real-time updates for assignments, comments, and mentions even when you're not active.
        </p>
        <button
          onClick={handleEnable}
          className={styles.enableBtn}
          aria-label="Enable desktop notifications"
        >
          Enable
        </button>
      </div>
    </div>
  );
}
