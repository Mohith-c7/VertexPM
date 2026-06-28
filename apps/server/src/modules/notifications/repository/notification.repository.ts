import { db } from "../../../db";
import { BuildNotificationInput } from "../types";
import {
  Notification,
  NotificationType,
  Prisma,
} from "@prisma/client";
import { notificationLogger } from "../logger";

const LOG_CTX = "NotificationRepository";

export class NotificationRepository {
  /** Create a single notification */
  async create(data: BuildNotificationInput): Promise<Notification> {
    notificationLogger.debug(LOG_CTX, "Creating notification", { type: data.type, recipientId: data.recipientId });
    return db.notification.create({
      data: {
        recipientId: data.recipientId,
        actorId: data.actorId,
        entityId: data.entityId,
        entityType: data.entityType,
        type: data.type,
        category: data.category,
        title: data.title,
        body: data.body,
        severity: data.severity ?? "INFO",
        priority: data.priority ?? "NORMAL",
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
  }

  /** Find a notification by id */
  async findById(id: string): Promise<Notification | null> {
    return db.notification.findUnique({ where: { id } });
  }

  /** Paginated list for a recipient, with filtering */
  async findMany(params: {
    recipientId: string;
    isRead?: boolean;
    isArchived?: boolean;
    type?: NotificationType;
    category?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Notification[]; total: number }> {
    const { recipientId, isRead, isArchived, type, category, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      recipientId,
      ...(isRead !== undefined && { isRead }),
      ...(isArchived !== undefined ? { isArchived } : { isArchived: false }),
      ...(type && { type }),
      ...(category && { category }),
    };

    const [data, total] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.notification.count({ where }),
    ]);

    return { data, total };
  }

  /** Count unread notifications */
  async countUnread(recipientId: string): Promise<number> {
    return db.notification.count({ where: { recipientId, isRead: false, isArchived: false } });
  }

  /** Mark single notification as read */
  async markRead(id: string): Promise<Notification> {
    return db.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /** Mark all notifications for user as read */
  async markAllRead(recipientId: string): Promise<number> {
    const result = await db.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return result.count;
  }

  /** Archive a single notification */
  async archive(id: string): Promise<Notification> {
    return db.notification.update({
      where: { id },
      data: { isArchived: true, archivedAt: new Date() },
    });
  }

  /** Delete a notification */
  async delete(id: string): Promise<void> {
    await db.notification.delete({ where: { id } });
  }

  /**
   * Find recent notification for grouping check.
   * Returns a notification with same type+entityId+recipientId created within windowMs.
   */
  async findRecentGroupable(params: {
    type: NotificationType;
    entityId: string;
    recipientId: string;
    windowMs: number;
  }): Promise<Notification | null> {
    const since = new Date(Date.now() - params.windowMs);
    return db.notification.findFirst({
      where: {
        type: params.type,
        entityId: params.entityId,
        recipientId: params.recipientId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const notificationRepository = new NotificationRepository();
