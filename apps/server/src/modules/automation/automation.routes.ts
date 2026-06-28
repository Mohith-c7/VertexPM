import type { FastifyInstance } from "fastify";
import {
  getRulesHandler,
  createRuleHandler,
  updateRuleHandler,
  deleteRuleHandler,
  enableRuleHandler,
  disableRuleHandler,
  getHistoryHandler,
  getJobsHandler,
  runJobHandler,
  cancelJobHandler,
  getRemindersHandler,
  createReminderHandler,
  deleteReminderHandler,
} from "./automation.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export async function automationRoutes(app: FastifyInstance) {
  // Apply authentication middleware to all routes in this module
  app.addHook("preHandler", requireAuth as any);

  // Automation Rules
  app.get("/rules", getRulesHandler);
  app.post("/rules", createRuleHandler);
  app.patch("/rules/:id", updateRuleHandler);
  app.delete("/rules/:id", deleteRuleHandler);
  app.patch("/rules/:id/enable", enableRuleHandler);
  app.patch("/rules/:id/disable", disableRuleHandler);

  // Execution History
  app.get("/history", getHistoryHandler);

  // Scheduled Jobs
  app.get("/jobs", getJobsHandler);
  app.post("/jobs/run", runJobHandler);
  app.post("/jobs/cancel", cancelJobHandler);

  // Reminders
  app.get("/reminders", getRemindersHandler);
  app.post("/reminders", createReminderHandler);
  app.delete("/reminders/:id", deleteReminderHandler);
}
