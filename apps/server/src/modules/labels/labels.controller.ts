import type { FastifyRequest, FastifyReply } from "fastify";
import { LabelsService } from "./labels.service";
import { createLabelSchema, updateLabelSchema } from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

const service = new LabelsService();

export class LabelsController {
  async createLabel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const data = createLabelSchema.parse(request.body);
      const label = await service.createLabel(data, user.id);
      return reply.send(successResponse("Label created successfully", label));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }

  async getWorkspaceLabels(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { workspaceId } = request.query as { workspaceId: string };
      const labels = await service.getWorkspaceLabels(workspaceId, user.id);
      return reply.send(successResponse("Labels retrieved successfully", labels));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }

  async updateLabel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { id } = request.params as { id: string };
      const data = updateLabelSchema.parse(request.body);
      const label = await service.updateLabel(id, data, user.id);
      return reply.send(successResponse("Label updated successfully", label));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }

  async deleteLabel(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { id } = request.params as { id: string };
      const label = await service.deleteLabel(id, user.id);
      return reply.send(successResponse("Label deleted successfully", label));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }

  async addLabelToWorkItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { workItemId, labelId } = request.body as { workItemId: string; labelId: string };
      const link = await service.addLabelToWorkItem(workItemId, labelId, user.id);
      return reply.send(successResponse("Label added to WorkItem successfully", link));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }

  async removeLabelFromWorkItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request as any).user;
      const { workItemId, labelId } = request.body as { workItemId: string; labelId: string };
      const link = await service.removeLabelFromWorkItem(workItemId, labelId, user.id);
      return reply.send(successResponse("Label removed from WorkItem successfully", link));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }

  async getWorkItemLabels(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { workItemId } = request.params as { workItemId: string };
      const labels = await service.getWorkItemLabels(workItemId);
      return reply.send(successResponse("WorkItem labels retrieved successfully", labels));
    } catch (error: any) {
      return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST"));
    }
  }
}
