import { FastifyReply, FastifyRequest } from "fastify";
import { notificationsService } from "./notifications.service";
import {
  getNotificationsQuerySchema,
  notificationIdParamSchema,
  getNotificationPreferencesQuerySchema,
  updateNotificationPreferencesSchema
} from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

function handleError(error: any, reply: FastifyReply) {
  if (error.name === "ZodError") {
    return reply.status(400).send(errorResponse("Validation failed", "BAD_REQUEST", error.errors));
  }
  if (error.statusCode && error.code) {
    return reply.status(error.statusCode).send(errorResponse(error.message, error.code));
  }
  return reply.status(500).send(errorResponse(error.message || "Internal server error", "INTERNAL_SERVER_ERROR"));
}

export async function getNotificationsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const query = getNotificationsQuerySchema.parse(req.query);
    const result = await notificationsService.getNotifications(userId, query);
    return reply.status(200).send(successResponse("Notifications fetched successfully", result));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getUnreadCountHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const unreadCount = await notificationsService.getUnreadCount(userId);
    return reply.status(200).send(successResponse("Unread count fetched successfully", { unreadCount }));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function markReadHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const params = notificationIdParamSchema.parse(req.params);
    const notification = await notificationsService.markRead(params.id, userId);
    return reply.status(200).send(successResponse("Notification marked as read successfully", notification));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function markAllReadHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const count = await notificationsService.markAllRead(userId);
    return reply.status(200).send(successResponse("All notifications marked as read successfully", { count }));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function archiveNotificationHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const params = notificationIdParamSchema.parse(req.params);
    const notification = await notificationsService.archiveNotification(params.id, userId);
    return reply.status(200).send(successResponse("Notification archived successfully", notification));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function deleteNotificationHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const params = notificationIdParamSchema.parse(req.params);
    await notificationsService.deleteNotification(params.id, userId);
    return reply.status(200).send(successResponse("Notification deleted successfully"));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function getPreferencesHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const query = getNotificationPreferencesQuerySchema.parse(req.query);
    const preferences = await notificationsService.getPreferences(userId, query.workspaceId, query.projectId);
    return reply.status(200).send(successResponse("Preferences fetched successfully", preferences));
  } catch (error) {
    return handleError(error, reply);
  }
}

export async function updatePreferencesHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user.id;
    const body = updateNotificationPreferencesSchema.parse(req.body);
    const preferences = await notificationsService.updatePreferences(userId, body);
    return reply.status(200).send(successResponse("Preferences updated successfully", preferences));
  } catch (error) {
    return handleError(error, reply);
  }
}
