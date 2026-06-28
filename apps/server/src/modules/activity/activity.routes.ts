import type { FastifyInstance } from "fastify";
import { 
  getWorkItemActivityHandler,
  getBoardActivityHandler,
  getProjectActivityHandler
} from "./activity.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function activityRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.get("/work-items/:id/activity", getWorkItemActivityHandler);
  app.get("/boards/:id/activity", getBoardActivityHandler);
  app.get("/projects/:id/activity", getProjectActivityHandler);
}
