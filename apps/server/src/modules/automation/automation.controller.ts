import { FastifyReply, FastifyRequest } from "fastify";
import { AutomationService } from "./automation.service.js";
import {
  createAutomationRuleSchema,
  updateAutomationRuleSchema,
  getAutomationRulesQuerySchema,
  getAutomationHistoryQuerySchema,
  getScheduledJobsQuerySchema,
  runJobSchema,
  cancelJobSchema,
  getRemindersQuerySchema,
  createReminderSchema,
  automationRuleIdParamSchema,
  reminderIdParamSchema,
} from "./validation/index.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { AutomationError } from "./errors/index.js";

const service = new AutomationService();

// ─── Rules Handlers ───────────────────────────────────────────────────────────

export async function getRulesHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = getAutomationRulesQuerySchema.parse(req.query);
    const userId = (req as any).user.id;
    const rules = await service.getRules(query, userId);
    return reply.status(200).send(successResponse("Rules fetched successfully", rules));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function createRuleHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = createAutomationRuleSchema.parse(req.body);
    const userId = (req as any).user.id;
    const rule = await service.createRule(body, userId);
    return reply.status(201).send(successResponse("Rule created successfully", rule));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function updateRuleHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = automationRuleIdParamSchema.parse(req.params);
    const body = updateAutomationRuleSchema.parse(req.body);
    const userId = (req as any).user.id;
    const rule = await service.updateRule(params.id, body, userId);
    return reply.status(200).send(successResponse("Rule updated successfully", rule));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function deleteRuleHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = automationRuleIdParamSchema.parse(req.params);
    const userId = (req as any).user.id;
    await service.deleteRule(params.id, userId);
    return reply.status(200).send(successResponse("Rule deleted successfully"));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function enableRuleHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = automationRuleIdParamSchema.parse(req.params);
    const userId = (req as any).user.id;
    const rule = await service.setRuleEnabled(params.id, true, userId);
    return reply.status(200).send(successResponse("Rule enabled successfully", rule));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function disableRuleHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = automationRuleIdParamSchema.parse(req.params);
    const userId = (req as any).user.id;
    const rule = await service.setRuleEnabled(params.id, false, userId);
    return reply.status(200).send(successResponse("Rule disabled successfully", rule));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

// ─── History Handler ───────────────────────────────────────────────────────────

export async function getHistoryHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = getAutomationHistoryQuerySchema.parse(req.query);
    const userId = (req as any).user.id;
    const history = await service.getHistory(query, userId);
    return reply.status(200).send(successResponse("Execution history fetched successfully", history));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

// ─── Jobs Handlers ────────────────────────────────────────────────────────────

export async function getJobsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = getScheduledJobsQuerySchema.parse(req.query);
    const jobs = await service.getJobs(query);
    return reply.status(200).send(successResponse("Scheduled jobs fetched successfully", jobs));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function runJobHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = runJobSchema.parse(req.body);
    const job = await service.runJob(body.jobType, body.payload);
    return reply.status(201).send(successResponse("Job triggered successfully", job));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function cancelJobHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = cancelJobSchema.parse(req.body);
    const job = await service.cancelJob(body.jobId);
    return reply.status(200).send(successResponse("Job cancelled successfully", job));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

// ─── Reminders Handlers ────────────────────────────────────────────────────────

export async function getRemindersHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = getRemindersQuerySchema.parse(req.query);
    const userId = (req as any).user.id;
    const reminders = await service.getReminders(query, userId);
    return reply.status(200).send(successResponse("Reminders fetched successfully", reminders));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function createReminderHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = createReminderSchema.parse(req.body);
    const userId = (req as any).user.id;
    const reminder = await service.createReminder(body, userId);
    return reply.status(201).send(successResponse("Reminder scheduled successfully", reminder));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

export async function deleteReminderHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = reminderIdParamSchema.parse(req.params);
    const userId = (req as any).user.id;
    await service.deleteReminder(params.id, userId);
    return reply.status(200).send(successResponse("Reminder deleted successfully"));
  } catch (error: any) {
    return handleControllerError(error, reply);
  }
}

// ─── Helper Error Dispatcher ──────────────────────────────────────────────────

function handleControllerError(error: any, reply: FastifyReply) {
  if (error instanceof AutomationError) {
    return reply.status(error.statusCode).send(errorResponse(error.message, error.code));
  }
  if (error.name === "ZodError") {
    return reply.status(400).send(errorResponse(error.message || "Validation failed", "VALIDATION_ERROR", error.errors));
  }
  return reply.status(500).send(errorResponse(error.message || "Internal server error", "INTERNAL_SERVER_ERROR", error));
}
