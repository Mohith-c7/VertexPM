import { FastifyReply, FastifyRequest } from "fastify";
import { activityService } from "./activity.service";
import { activityParamsSchema, getActivityQuerySchema } from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

export async function getWorkItemActivityHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = activityParamsSchema.parse(req.params);
    const query = getActivityQuerySchema.parse(req.query);
    const result = await activityService.getWorkItemActivity(params.id, query);
    return reply.status(200).send(successResponse("Activity fetched successfully", result));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getBoardActivityHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = activityParamsSchema.parse(req.params);
    const query = getActivityQuerySchema.parse(req.query);
    const result = await activityService.getBoardActivity(params.id, query);
    return reply.status(200).send(successResponse("Activity fetched successfully", result));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getProjectActivityHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = activityParamsSchema.parse(req.params);
    const query = getActivityQuerySchema.parse(req.query);
    const result = await activityService.getProjectActivity(params.id, query);
    return reply.status(200).send(successResponse("Activity fetched successfully", result));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}
