import type { FastifyInstance } from "fastify";
import {
  getNotificationsHandler,
  getUnreadCountHandler,
  markReadHandler,
  markAllReadHandler,
  archiveNotificationHandler,
  deleteNotificationHandler,
  getPreferencesHandler,
  updatePreferencesHandler
} from "./notifications.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function notificationsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.get("/", getNotificationsHandler);
  app.get("/unread-count", getUnreadCountHandler);
  app.patch("/:id/read", markReadHandler);
  app.patch("/read-all", markAllReadHandler);
  app.patch("/:id/archive", archiveNotificationHandler);
  app.delete("/:id", deleteNotificationHandler);
  app.get("/preferences", getPreferencesHandler);
  app.patch("/preferences", updatePreferencesHandler);
}
