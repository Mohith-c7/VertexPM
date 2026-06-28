import { fastify, type FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";
import { workspacesRoutes } from "./modules/workspaces/workspaces.routes";
import { boardsRoutes } from "./modules/boards/boards.routes";
import { projectsRoutes } from "./modules/projects/projects.routes";
import { workItemsRoutes } from "./modules/workitems/workitems.routes";
import { commentsRoutes } from "./modules/comments/comments.routes";
import { attachmentsRoutes } from "./modules/attachments/attachments.routes";
import { activityRoutes } from "./modules/activity/activity.routes";
import { aiContextRoutes } from "./modules/ai/context/context.routes";
import { intelligenceRoutes } from "./modules/ai/intelligence/intelligence.routes";
import { skillsRoutes } from "./modules/ai/skills/skills.routes";

import { realtimeSyncPlugin } from "./modules/realtime-sync/realtime.plugin";

export function buildApp(): FastifyInstance {
  const app = fastify({ logger: true });

  app.register(realtimeSyncPlugin);

  app.get("/health", async () => ({ status: "ok" }));

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(workspacesRoutes, { prefix: "/api/workspaces" });
  app.register(projectsRoutes, { prefix: "/api/projects" });
  app.register(boardsRoutes, { prefix: "/api" });
  app.register(workItemsRoutes, { prefix: "/api" });
  app.register(commentsRoutes, { prefix: "/api" });
  app.register(attachmentsRoutes, { prefix: "/api" });
  app.register(activityRoutes, { prefix: "/api" });
  app.register(aiContextRoutes, { prefix: "/api/ai" });
  app.register(intelligenceRoutes, { prefix: "/api/ai" });
  app.register(skillsRoutes, { prefix: "/api/ai/skills" });

  return app;
}
