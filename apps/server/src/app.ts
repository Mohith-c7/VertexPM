import { fastify, type FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";
import { workspacesRoutes } from "./modules/workspaces/workspaces.routes";
import { boardsRoutes } from "./modules/boards/boards.routes";
import { projectsRoutes } from "./modules/projects/projects.routes";

export function buildApp(): FastifyInstance {
  const app = fastify({ logger: true });

  app.get("/health", async () => ({ status: "ok" }));

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(workspacesRoutes, { prefix: "/api/workspaces" });
  app.register(projectsRoutes, { prefix: "/api/projects" });
  app.register(boardsRoutes, { prefix: "/api" });

  return app;
}
