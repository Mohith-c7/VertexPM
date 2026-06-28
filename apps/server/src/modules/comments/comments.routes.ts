import type { FastifyInstance } from "fastify";
import { 
  createCommentHandler, 
  getCommentsHandler, 
  updateCommentHandler, 
  deleteCommentHandler 
} from "./comments.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function commentsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.post("/work-items/:id/comments", createCommentHandler);
  app.get("/work-items/:id/comments", getCommentsHandler);
  
  app.patch("/comments/:id", updateCommentHandler);
  app.delete("/comments/:id", deleteCommentHandler);
}
