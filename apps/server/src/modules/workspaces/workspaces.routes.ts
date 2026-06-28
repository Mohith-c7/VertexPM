import type { FastifyInstance } from "fastify";
import { 
  createWorkspaceHandler, 
  getWorkspacesHandler, 
  getWorkspaceByIdHandler, 
  updateWorkspaceHandler, 
  deleteWorkspaceHandler,
  getMembersHandler,
  addMemberHandler,
  removeMemberHandler
} from "./workspaces.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function workspacesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.post("/", createWorkspaceHandler);
  app.get("/", getWorkspacesHandler);
  app.get("/:id", getWorkspaceByIdHandler);
  app.patch("/:id", updateWorkspaceHandler);
  app.delete("/:id", deleteWorkspaceHandler);

  app.get("/:id/members", getMembersHandler);
  app.post("/:id/members", addMemberHandler);
  app.delete("/:id/members/:memberId", removeMemberHandler);
}
