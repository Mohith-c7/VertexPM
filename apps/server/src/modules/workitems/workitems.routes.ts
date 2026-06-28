import { FastifyInstance } from "fastify";
import { workItemController } from "./workitems.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function workItemsRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", requireAuth);

  // Board level endpoints
  fastify.post("/boards/:boardId/work-items", workItemController.create.bind(workItemController));
  fastify.get("/boards/:boardId/work-items", workItemController.getBoardWorkItems.bind(workItemController));

  // WorkItem specific endpoints
  fastify.get("/work-items/:id", workItemController.getById.bind(workItemController));
  fastify.patch("/work-items/:id", workItemController.update.bind(workItemController));
  fastify.delete("/work-items/:id", workItemController.delete.bind(workItemController));

  // Subtasks
  fastify.post("/work-items/:id/subtasks", workItemController.createSubtask.bind(workItemController));
  fastify.get("/work-items/:id/subtasks", workItemController.getSubtasks.bind(workItemController));

  // Dependencies
  fastify.post("/work-items/:id/dependencies", workItemController.createDependency.bind(workItemController));
  fastify.get("/work-items/:id/dependencies", workItemController.getDependencies.bind(workItemController));
  
  // Notice this one is on /dependencies/:id based on the instruction
  fastify.delete("/dependencies/:id", workItemController.deleteDependency.bind(workItemController));

  // Granular PATCH updates (handled via update for simplicity, but mapped explicitly for RESTful realtime design)
  fastify.patch("/work-items/:id/status", workItemController.update.bind(workItemController));
  fastify.patch("/work-items/:id/priority", workItemController.update.bind(workItemController));
  fastify.patch("/work-items/:id/assignee", workItemController.update.bind(workItemController));
}
