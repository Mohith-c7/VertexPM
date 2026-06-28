import { fastify, type FastifyInstance } from "fastify";
import { authRoutes } from "./modules/auth/auth.routes";

export function buildApp(): FastifyInstance {
  const app = fastify({ logger: true });

  app.get("/health", async () => ({ status: "ok" }));

  app.register(authRoutes, { prefix: "/api/auth" });

  return app;
}

