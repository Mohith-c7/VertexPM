import { FastifyReply, FastifyRequest } from "fastify";
import { CommentsService } from "./comments.service";
import { 
  createCommentSchema, 
  updateCommentSchema, 
  commentParamsSchema,
  getCommentsQuerySchema
} from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

const service = new CommentsService();

export async function createCommentHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = commentParamsSchema.parse(req.params); // workItemId
    const body = createCommentSchema.parse(req.body);
    const comment = await service.createComment(params.id, body, (req as any).user.id);
    return reply.status(201).send(successResponse("Comment created successfully", comment));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getCommentsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = commentParamsSchema.parse(req.params); // workItemId
    const query = getCommentsQuerySchema.parse(req.query);
    const result = await service.getComments(params.id, query);
    return reply.status(200).send(successResponse("Comments fetched successfully", result));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function updateCommentHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = commentParamsSchema.parse(req.params);
    const body = updateCommentSchema.parse(req.body);
    const comment = await service.updateComment(params.id, body, (req as any).user.id);
    return reply.status(200).send(successResponse("Comment updated successfully", comment));
  } catch (error: any) {
    if (error.message === "Not found") return reply.status(404).send(errorResponse("Not found", "NOT_FOUND"));
    if (error.message.includes("Unauthorized")) return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function deleteCommentHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = commentParamsSchema.parse(req.params);
    await service.deleteComment(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Comment deleted successfully"));
  } catch (error: any) {
    if (error.message === "Not found") return reply.status(404).send(errorResponse("Not found", "NOT_FOUND"));
    if (error.message.includes("Unauthorized")) return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}
