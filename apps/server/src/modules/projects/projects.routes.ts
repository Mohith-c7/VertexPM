import type { FastifyInstance } from "fastify";
import { 
  createProjectHandler, 
  getProjectsHandler, 
  getProjectByIdHandler, 
  updateProjectHandler, 
  deleteProjectHandler 
} from "./projects.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function projectsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.post("/", createProjectHandler);
  app.get("/", getProjectsHandler);
  app.get("/:id", getProjectByIdHandler);
  app.patch("/:id", updateProjectHandler);
  app.delete("/:id", deleteProjectHandler);
}
