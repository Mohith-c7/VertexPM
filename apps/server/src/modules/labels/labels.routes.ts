import type { FastifyInstance } from "fastify";
import { LabelsController } from "./labels.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const controller = new LabelsController();

export async function labelsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/labels", controller.createLabel);
  app.get("/labels", controller.getWorkspaceLabels);
  app.patch("/labels/:id", controller.updateLabel);
  app.delete("/labels/:id", controller.deleteLabel);

  app.post("/workitems/labels", controller.addLabelToWorkItem);
  app.delete("/workitems/labels", controller.removeLabelFromWorkItem);
  app.get("/workitems/:workItemId/labels", controller.getWorkItemLabels);
}
