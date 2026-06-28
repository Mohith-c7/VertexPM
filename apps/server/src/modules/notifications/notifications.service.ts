import { notificationRepository } from "./repository/notification.repository";
import { preferenceService } from "./preferences/preference.service";
import { realtimeDispatcher } from "../realtime-sync";
import {
  NotificationNotFoundError,
  NotificationUnauthorizedError
} from "./errors";
import { SOCKET_EVENTS } from "./constants";
import { GetNotificationsQuery, UpdateNotificationPreferences } from "@vertexpm/validation";
import { Notification, NotificationPreference } from "@prisma/client";

export class NotificationsService {
  async getNotifications(userId: string, query: GetNotificationsQuery) {
    const { isRead, isArchived, type, category, page, limit } = query;
    return notificationRepository.findMany({
      recipientId: userId,
      isRead,
      isArchived,
      type,
      category,
      page,
      limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.countUnread(userId);
  }

  async markRead(id: string, userId: string): Promise<Notification> {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotificationNotFoundError(id);
    }
    if (notification.recipientId !== userId) {
      throw new NotificationUnauthorizedError();
    }

    const updated = await notificationRepository.markRead(id);

    // Publish socket events
    realtimeDispatcher.dispatch({
      event: SOCKET_EVENTS.NOTIFICATION_READ,
      entityId: id,
      recipientId: userId,
      payload: { id, recipientId: userId, isRead: true },
    });

    await this.publishCountUpdate(userId);

    return updated;
  }

  async markAllRead(userId: string): Promise<number> {
    const count = await notificationRepository.markAllRead(userId);

    // Send count updated socket event
    await this.publishCountUpdate(userId);

    return count;
  }

  async archiveNotification(id: string, userId: string): Promise<Notification> {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotificationNotFoundError(id);
    }
    if (notification.recipientId !== userId) {
      throw new NotificationUnauthorizedError();
    }

    const updated = await notificationRepository.archive(id);

    // Publish socket events
    realtimeDispatcher.dispatch({
      event: SOCKET_EVENTS.NOTIFICATION_ARCHIVED,
      entityId: id,
      recipientId: userId,
      payload: { id, recipientId: userId, isArchived: true },
    });

    await this.publishCountUpdate(userId);

    return updated;
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await notificationRepository.findById(id);
    if (!notification) {
      throw new NotificationNotFoundError(id);
    }
    if (notification.recipientId !== userId) {
      throw new NotificationUnauthorizedError();
    }

    await notificationRepository.delete(id);

    await this.publishCountUpdate(userId);
  }

  async getPreferences(
    userId: string,
    workspaceId?: string,
    projectId?: string
  ): Promise<NotificationPreference | null> {
    return preferenceService.getPreferences(userId, workspaceId, projectId);
  }

  async updatePreferences(
    userId: string,
    data: UpdateNotificationPreferences
  ): Promise<NotificationPreference> {
    return preferenceService.upsertPreferences(userId, {
      workspaceId: data.workspaceId ?? undefined,
      projectId: data.projectId ?? undefined,
      types: data.types,
      channels: data.channels,
      quietHours: data.quietHours,
      digestFreq: data.digestFreq ?? undefined,
    });
  }

  private async publishCountUpdate(recipientId: string): Promise<void> {
    try {
      const count = await notificationRepository.countUnread(recipientId);
      realtimeDispatcher.dispatch({
        event: SOCKET_EVENTS.NOTIFICATION_COUNT_UPDATED,
        entityId: recipientId,
        recipientId,
        payload: { recipientId, unreadCount: count },
      });
    } catch (err) {
      // Suppress or log
    }
  }
}

export const notificationsService = new NotificationsService();
