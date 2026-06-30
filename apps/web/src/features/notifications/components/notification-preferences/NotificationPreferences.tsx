'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2, Save, VolumeX, ShieldAlert, X } from 'lucide-react';
import { useNotificationPreferences } from '../../hooks/use-notification-preferences';
import { BrowserPermission } from '../browser-permission/BrowserPermission';
import { NOTIFICATION_TYPE_CONFIG } from '../../constants';
import { NotificationType, NotificationChannel } from '../../types';
import api from '@/services/api';
import styles from './notification-preferences.module.css';

interface Workspace {
  id: string;
  name: string;
}

interface NotificationPreferencesProps {
  onBack: () => void;
  onClose?: () => void;
}

export function NotificationPreferences({ onBack, onClose }: NotificationPreferencesProps) {
  const {
    preferences,
    isLoading,
    isSaving,
    error,
    save,
    toggleTypeEnabled,
    toggleTypeChannel,
  } = useNotificationPreferences();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [wsEnabled, setWsEnabled] = useState(true);

  // Fetch workspaces for per-workspace settings
  useEffect(() => {
    async function getWorkspaces() {
      try {
        const res = await api.get('/workspaces');
        const data = res.data?.data || res.data || [];
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspaceId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load workspaces in preferences', err);
      }
    }
    getWorkspaces();
  }, []);

  // Update selected workspace preferences local state when workspaces or preferences change
  useEffect(() => {
    if (!selectedWorkspaceId || !preferences.workspacePreferences) return;
    const wsPref = preferences.workspacePreferences.find(
      (w) => w.workspaceId === selectedWorkspaceId
    );
    setWsEnabled(wsPref ? wsPref.enabled : true);
  }, [selectedWorkspaceId, preferences.workspacePreferences]);

  const handleWorkspaceToggle = (enabled: boolean) => {
    setWsEnabled(enabled);
    
    // Construct workspace preferences array
    const currentWsPrefs = preferences.workspacePreferences || [];
    const existingIdx = currentWsPrefs.findIndex((w) => w.workspaceId === selectedWorkspaceId);
    
    const updatedWsPrefs = [...currentWsPrefs];
    if (existingIdx > -1) {
      updatedWsPrefs[existingIdx] = {
        ...updatedWsPrefs[existingIdx],
        enabled,
      };
    } else {
      updatedWsPrefs.push({
        workspaceId: selectedWorkspaceId,
        enabled,
        types: preferences.types.map((t) => ({ ...t })),
      });
    }
    
    save({ workspacePreferences: updatedWsPrefs });
  };

  const handleQuietHoursChange = (updates: { enabled?: boolean; startTime?: string; endTime?: string }) => {
    save({
      quietHours: {
        ...preferences.quietHours,
        ...updates,
      },
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <Loader2 className={styles.spinner} />
        <span>Loading preferences...</span>
      </div>
    );
  }

  return (
    <div className={styles.panel} role="region" aria-label="Notification Preferences">
      <div className={styles.header}>
        <button
          onClick={onBack}
          className={styles.backBtn}
          aria-label="Back to notifications"
        >
          <ArrowLeft className={styles.icon} />
        </button>
        <h3 className={styles.title}>Notification Settings</h3>
        {isSaving && (
          <span className={styles.savingIndicator}>
            <Loader2 className={styles.miniSpinner} /> Saving...
          </span>
        )}
        {!isSaving && !error && (
          <span className={styles.savedIndicator}>
            <Check className={styles.miniCheck} /> Saved
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className={styles.backBtn}
            title="Close panel"
            aria-label="Close notifications panel"
            style={{ marginLeft: '8px' }}
          >
            <X className={styles.icon} />
          </button>
        )}
      </div>

      <div className={styles.scrollArea}>
        {error && (
          <div className={styles.errorAlert} role="alert">
            <ShieldAlert className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}

        {/* Browser Permission Prompt */}
        <div className={styles.section}>
          <BrowserPermission />
        </div>

        {/* Delivery Channels */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Delivery Channels</h4>
          <p className={styles.sectionDesc}>Choose where you want to receive notifications.</p>
          
          <div className={styles.channelRow}>
            <label className={styles.channelLabel}>
              <span className={styles.channelName}>In-App Notifications</span>
              <span className={styles.channelSub}>Show notification count and list inside the app</span>
            </label>
            <input
              type="checkbox"
              className={styles.switch}
              checked={preferences.inAppEnabled}
              onChange={(e) => save({ inAppEnabled: e.target.checked })}
              aria-label="Toggle in-app notifications"
            />
          </div>

          <div className={styles.channelRow}>
            <label className={styles.channelLabel}>
              <span className={styles.channelName}>Browser Notifications</span>
              <span className={styles.channelSub}>Send push alerts when the browser is running</span>
            </label>
            <input
              type="checkbox"
              className={styles.switch}
              checked={preferences.browserEnabled}
              onChange={(e) => save({ browserEnabled: e.target.checked })}
              aria-label="Toggle browser notifications"
            />
          </div>

          <div className={styles.channelRow}>
            <label className={styles.channelLabel}>
              <span className={styles.channelName}>Email Digests</span>
              <span className={styles.channelSub}>Send summary emails of missed notifications</span>
            </label>
            <input
              type="checkbox"
              className={styles.switch}
              checked={preferences.emailEnabled}
              onChange={(e) => save({ emailEnabled: e.target.checked })}
              aria-label="Toggle email notifications"
            />
          </div>
        </div>

        {/* Quiet Hours */}
        <div className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <VolumeX className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle} style={{ margin: 0 }}>Quiet Hours</h4>
            <input
              type="checkbox"
              className={styles.switch}
              checked={preferences.quietHours.enabled}
              onChange={(e) => handleQuietHoursChange({ enabled: e.target.checked })}
              aria-label="Toggle quiet hours"
            />
          </div>
          <p className={styles.sectionDesc}>
            Mute notifications during specific hours. Notifications will still accumulate in-app.
          </p>
          
          {preferences.quietHours.enabled && (
            <div className={styles.timeRangePicker}>
              <div className={styles.timeField}>
                <label className={styles.timeLabel}>Mute starts at</label>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={preferences.quietHours.startTime}
                  onChange={(e) => handleQuietHoursChange({ startTime: e.target.value })}
                  aria-label="Quiet hours start time"
                />
              </div>
              <div className={styles.timeField}>
                <label className={styles.timeLabel}>Ends at</label>
                <input
                  type="time"
                  className={styles.timeInput}
                  value={preferences.quietHours.endTime}
                  onChange={(e) => handleQuietHoursChange({ endTime: e.target.value })}
                  aria-label="Quiet hours end time"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification Types */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Notification Types</h4>
          <p className={styles.sectionDesc}>Configure which events trigger notifications and which channels they use.</p>
          
          <div className={styles.typesList}>
            {preferences.types.map((typePref) => {
              const config = NOTIFICATION_TYPE_CONFIG[typePref.type];
              if (!config) return null;
              
              return (
                <div key={typePref.type} className={styles.typeRow}>
                  <div className={styles.typeInfo}>
                    <span className={styles.typeIconIndicator} style={{ background: config.color }}>
                      <span className={styles.typeIconDot} />
                    </span>
                    <div>
                      <span className={styles.typeName}>{config.label}</span>
                    </div>
                  </div>
                  
                  <div className={styles.typeActions}>
                    <label className={styles.checkboxLabel} title="Enable in-app channel">
                      <input
                        type="checkbox"
                        checked={typePref.channels.includes('IN_APP')}
                        onChange={() => toggleTypeChannel(typePref.type, 'IN_APP')}
                        disabled={!typePref.enabled}
                      />
                      <span>App</span>
                    </label>
                    <label className={styles.checkboxLabel} title="Enable browser push channel">
                      <input
                        type="checkbox"
                        checked={typePref.channels.includes('BROWSER')}
                        onChange={() => toggleTypeChannel(typePref.type, 'BROWSER')}
                        disabled={!typePref.enabled}
                      />
                      <span>Push</span>
                    </label>
                    <input
                      type="checkbox"
                      className={styles.switch}
                      checked={typePref.enabled}
                      onChange={() => toggleTypeEnabled(typePref.type)}
                      title={`Enable notifications for ${config.label}`}
                      aria-label={`Toggle notifications for ${config.label}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workspace Preferences */}
        {workspaces.length > 0 && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Workspace Preferences</h4>
            <p className={styles.sectionDesc}>Customize notifications per workspace.</p>

            <div className={styles.workspaceSelectRow}>
              <select
                className={styles.select}
                value={selectedWorkspaceId}
                onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                aria-label="Select workspace to configure"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>

              <div className={styles.wsToggle}>
                <span className={styles.wsToggleLabel}>Enable Notifications</span>
                <input
                  type="checkbox"
                  className={styles.switch}
                  checked={wsEnabled}
                  onChange={(e) => handleWorkspaceToggle(e.target.checked)}
                  aria-label="Toggle notifications for selected workspace"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
