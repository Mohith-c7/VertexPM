import { fastify, type FastifyInstance } from "fastify";

export function buildApp(): FastifyInstance {
  const app = fastify({ logger: false });

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
