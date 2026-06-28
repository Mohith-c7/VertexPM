import { FastifyReply, FastifyRequest } from "fastify";
import { AttachmentsService } from "./attachments.service";
import { 
  createAttachmentSchema, 
  attachmentParamsSchema,
  getAttachmentsQuerySchema
} from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

const service = new AttachmentsService();

export async function createAttachmentHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = attachmentParamsSchema.parse(req.params); // workItemId
    const body = createAttachmentSchema.parse(req.body);
    const attachment = await service.uploadAttachment(params.id, body, (req as any).user.id);
    return reply.status(201).send(successResponse("Attachment created successfully", attachment));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getAttachmentsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = attachmentParamsSchema.parse(req.params); // workItemId
    const query = getAttachmentsQuerySchema.parse(req.query);
    const result = await service.getAttachments(params.id, query);
    return reply.status(200).send(successResponse("Attachments fetched successfully", result));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function deleteAttachmentHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = attachmentParamsSchema.parse(req.params);
    await service.deleteAttachment(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Attachment deleted successfully"));
  } catch (error: any) {
    if (error.message === "Not found") return reply.status(404).send(errorResponse("Not found", "NOT_FOUND"));
    if (error.message.includes("Unauthorized")) return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}
