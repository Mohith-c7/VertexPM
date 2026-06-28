import { FastifyInstance } from "fastify";
import { ContextController } from "./context.controller";
import { requireAuth } from "../../../middleware/auth.middleware";

export async function aiContextRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.post("/chat", ContextController.chat);
  app.get("/conversations", ContextController.getConversations);
  app.post("/conversations", ContextController.createConversation);
  app.get("/conversations/:id", ContextController.getConversation);
  app.post("/conversations/:id/messages", ContextController.addMessage);
}
