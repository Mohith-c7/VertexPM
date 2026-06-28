import type { FastifyInstance } from "fastify";
import { 
  createAttachmentHandler, 
  getAttachmentsHandler, 
  deleteAttachmentHandler 
} from "./attachments.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function attachmentsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.post("/work-items/:id/attachments", createAttachmentHandler);
  app.get("/work-items/:id/attachments", getAttachmentsHandler);
  
  app.delete("/attachments/:id", deleteAttachmentHandler);
}
