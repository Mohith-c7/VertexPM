'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  AtSign,
  MessageCircle,
  CornerDownRight,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Bell,
  Info,
  Check,
  Archive,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Notification, NotificationType } from '../../types';
import { formatRelativeTime, getInitials, getAvatarColor, getEntityUrl } from '../../utils';
import { PRIORITY_CONFIG } from '../../constants';
import styles from './notification-card.module.css';

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  ASSIGNMENT: <UserCheck />,
  MENTION: <AtSign />,
  COMMENT: <MessageCircle />,
  REPLY: <CornerDownRight />,
  STATUS_CHANGE: <RefreshCw />,
  PRIORITY_CHANGE: <AlertTriangle />,
  DUE_DATE: <Calendar />,
  REMINDER: <Bell />,
  SYSTEM: <Info />,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  ASSIGNMENT: '#6366f1',
  MENTION: '#8b5cf6',
  COMMENT: '#0ea5e9',
  REPLY: '#06b6d4',
  STATUS_CHANGE: '#10b981',
  PRIORITY_CHANGE: '#f59e0b',
  DUE_DATE: '#ef4444',
  REMINDER: '#f97316',
  SYSTEM: '#64748b',
};

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isNew?: boolean;
}

export function NotificationCard({
  notification,
  onMarkRead,
  onArchive,
  onDelete,
  isNew = false,
}: NotificationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUnread = notification.status === 'UNREAD';
  const actorName = notification.actor?.name || 'System';
  const initials = getInitials(actorName);
  const avatarColor = getAvatarColor(actorName);
  const entityUrl = getEntityUrl(notification);
  const typeColor = TYPE_COLORS[notification.type];
  const priorityConfig =
    notification.priority !== 'NORMAL' && notification.priority !== 'LOW'
      ? PRIORITY_CONFIG[notification.priority]
      : null;

  const handleClick = () => {
    if (isUnread) onMarkRead(notification.id);
  };

  const handleOpenEntity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnread) onMarkRead(notification.id);
    if (entityUrl && entityUrl !== '#') {
      window.location.href = entityUrl;
    }
  };

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkRead(notification.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <article
      className={[
        styles.card,
        isUnread ? styles.unread : '',
        isNew ? styles.newNotif : '',
      ].join(' ')}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${notification.title}. ${isUnread ? 'Unread.' : 'Read.'}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Unread accent border */}
      {isUnread && (
        <span
          className={styles.unreadAccent}
          style={{ background: typeColor }}
          aria-hidden="true"
        />
      )}

      {/* Avatar */}
      <div className={styles.avatarWrapper}>
        {notification.actor?.avatarUrl ? (
          <img
            src={notification.actor.avatarUrl}
            alt={actorName}
            className={styles.avatar}
          />
        ) : (
          <div
            className={styles.avatarFallback}
            style={{ background: avatarColor }}
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        {/* Type icon badge */}
        <span
          className={styles.typeIcon}
          style={{ background: typeColor }}
          aria-hidden="true"
        >
          {TYPE_ICONS[notification.type]}
        </span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.actor}>{actorName}</span>
          {priorityConfig && (
            <span
              className={styles.priorityBadge}
              style={{ color: priorityConfig.color, borderColor: `${priorityConfig.color}30`, background: `${priorityConfig.color}12` }}
            >
              {priorityConfig.label}
            </span>
          )}
        </div>

        <h4 className={styles.title}>{notification.title}</h4>
        {notification.body && (
          <p className={styles.body}>{notification.body}</p>
        )}

        <div className={styles.footer}>
          <time
            className={styles.timestamp}
            dateTime={notification.createdAt}
            title={new Date(notification.createdAt).toLocaleString()}
          >
            {formatRelativeTime(notification.createdAt)}
          </time>
          {notification.entity?.title && (
            <>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.entityTitle}>{notification.entity.title}</span>
            </>
          )}
        </div>
      </div>

      {/* Unread dot */}
      {isUnread && (
        <span className={styles.unreadDot} aria-hidden="true" style={{ background: typeColor }} />
      )}

      {/* Hover actions */}
      <div
        className={[styles.actions, isHovered ? styles.actionsVisible : ''].join(' ')}
        role="group"
        aria-label="Notification actions"
      >
        <button
          className={styles.actionBtn}
          onClick={handleOpenEntity}
          title="Open"
          aria-label="Open entity"
        >
          <ExternalLink />
        </button>
        {isUnread && (
          <button
            className={styles.actionBtn}
            onClick={handleMarkRead}
            title="Mark as read"
            aria-label="Mark as read"
          >
            <Check />
          </button>
        )}
        <button
          className={styles.actionBtn}
          onClick={handleArchive}
          title="Archive"
          aria-label="Archive notification"
        >
          <Archive />
        </button>
        <button
          className={[styles.actionBtn, styles.danger].join(' ')}
          onClick={handleDelete}
          title="Delete"
          aria-label="Delete notification"
        >
          <Trash2 />
        </button>
      </div>
    </article>
  );
}
