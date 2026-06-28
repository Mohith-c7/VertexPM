import { FastifyRequest, FastifyReply } from "fastify";
import { workItemService } from "./workitems.service";
import { createWorkItemSchema, updateWorkItemSchema, queryWorkItemsSchema, createDependencySchema } from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

export class WorkItemController {
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { boardId } = req.params as { boardId: string };
      const parsed = createWorkItemSchema.parse(req.body);
      
      const userId = (req as any).user.id;
      const workItem = await workItemService.createWorkItem(boardId, userId, parsed);
      return reply.code(201).send(successResponse("WorkItem created successfully", workItem));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to create WorkItem", "BAD_REQUEST", error.message));
    }
  }

  async getBoardWorkItems(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { boardId } = req.params as { boardId: string };
      const parsed = queryWorkItemsSchema.parse(req.query);
      
      const data = await workItemService.getWorkItems(boardId, parsed);
      return reply.send(successResponse("WorkItems fetched", data));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to fetch WorkItems", "BAD_REQUEST", error.message));
    }
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const workItem = await workItemService.getWorkItemById(id);
      return reply.send(successResponse("WorkItem fetched", workItem));
    } catch (error: any) {
      return reply.code(404).send(errorResponse("WorkItem not found", "NOT_FOUND", error.message));
    }
  }

  async update(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const parsed = updateWorkItemSchema.parse(req.body);
      
      const workItem = await workItemService.updateWorkItem(id, parsed);
      return reply.send(successResponse("WorkItem updated successfully", workItem));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to update WorkItem", "BAD_REQUEST", error.message));
    }
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await workItemService.deleteWorkItem(id);
      return reply.send(successResponse("WorkItem deleted successfully", null));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to delete WorkItem", "BAD_REQUEST", error.message));
    }
  }

  async createSubtask(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: parentId } = req.params as { id: string };
      const parent = await workItemService.getWorkItemById(parentId);
      
      const parsed = createWorkItemSchema.parse(req.body);
      const userId = (req as any).user.id;
      const workItem = await workItemService.createWorkItem(parent.boardId, userId, parsed, parentId);
      
      return reply.code(201).send(successResponse("Subtask created successfully", workItem));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to create subtask", "BAD_REQUEST", error.message));
    }
  }

  async getSubtasks(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const subtasks = await workItemService.getSubtasks(id);
      return reply.send(successResponse("Subtasks fetched", subtasks));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to fetch subtasks", "BAD_REQUEST", error.message));
    }
  }

  async createDependency(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: predecessorId } = req.params as { id: string };
      const { successorId } = createDependencySchema.parse(req.body);
      
      const dependency = await workItemService.createDependency(predecessorId, successorId);
      return reply.code(201).send(successResponse("Dependency created successfully", dependency));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to create dependency", "BAD_REQUEST", error.message));
    }
  }

  async getDependencies(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const dependencies = await workItemService.getDependencies(id);
      return reply.send(successResponse("Dependencies fetched", dependencies));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to fetch dependencies", "BAD_REQUEST", error.message));
    }
  }

  async deleteDependency(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await workItemService.deleteDependency(id);
      return reply.send(successResponse("Dependency deleted successfully", null));
    } catch (error: any) {
      return reply.code(400).send(errorResponse("Failed to delete dependency", "BAD_REQUEST", error.message));
    }
  }
}

export const workItemController = new WorkItemController();
