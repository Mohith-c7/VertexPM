import { db } from "../../../db.js";
import { conditionEvaluator } from "../conditions/condition.evaluator.js";
import { actionExecutor } from "../actions/action.executor.js";
import { executionHistoryService } from "../history/execution.history.js";
import { retryPolicy } from "../scheduler/retry.policy.js";
import { AutomationContext, AutomationRule } from "../types/index.js";
import { MAX_EXECUTION_DEPTH } from "../constants/index.js";
import { LoopPreventionError } from "../errors/index.js";
import { automationLogger } from "../logger/index.js";

export class AutomationExecutor {
  async executeRule(
    rule: AutomationRule,
    entityId: string,
    entityType: string,
    context: AutomationContext
  ): Promise<void> {
    const startTime = Date.now();

    // 1. Depth-based Loop Prevention
    if (context.depth > MAX_EXECUTION_DEPTH) {
      const msg = `Max execution depth of ${MAX_EXECUTION_DEPTH} exceeded for rule ${rule.id}`;
      automationLogger.error("AutomationExecutor", msg);
      throw new LoopPreventionError(msg);
    }

    // 2. Direct Chain Recursion Loop Prevention
    if (context.executedRuleIds.has(rule.id)) {
      const msg = `Direct recursive rule execution prevented for rule: ${rule.id}`;
      automationLogger.error("AutomationExecutor", msg);
      throw new LoopPreventionError(msg);
    }

    // 3. Time-window Loop Prevention (prevent same rule executing more than once per event within 1 second)
    const oneSecondAgo = new Date(Date.now() - 1000);
    const recentLog = await db.executionLog.findFirst({
      where: {
        ruleId: rule.id,
        executedAt: { gte: oneSecondAgo },
        status: { in: ["SUCCESS", "FAILED"] },
      },
    });

    if (recentLog) {
      const msg = `Rule ${rule.id} has already executed within the last 1 second. Execution skipped to prevent a loop.`;
      automationLogger.warn("AutomationExecutor", msg, { ruleId: rule.id });
      return;
    }

    // Track execution in context
    context.executedRuleIds.add(rule.id);

    let actionsRun = 0;
    try {
      // Parse conditions & actions stored in DB
      const conditions = rule.conditions ? JSON.parse(rule.conditions) : [];
      const actions = JSON.parse(rule.actions);

      // Evaluate conditions
      const conditionCtx = {
        entityId,
        entityType,
        workspaceId: rule.workspaceId,
        projectId: rule.projectId || undefined,
        actorId: context.actorId,
        event: context.triggerEvent,
      };

      const conditionsPassed = await conditionEvaluator.evaluateAll(conditions, conditionCtx);
      if (!conditionsPassed) {
        automationLogger.debug("AutomationExecutor", `Conditions did not pass for rule ${rule.name} (${rule.id}). Skipping actions.`);
        return;
      }

      // Execute actions with retry policy
      const actionCtx = {
        entityId,
        entityType,
        workspaceId: rule.workspaceId,
        projectId: rule.projectId || undefined,
        actorId: context.actorId,
        event: context.triggerEvent,
      };

      actionsRun = await retryPolicy.executeWithRetry(
        () => actionExecutor.executeAll(actions, actionCtx),
        (err, delay, attempt) => {
          automationLogger.warn("AutomationExecutor", `Action execution failed: ${err.message}. Retrying in ${delay}ms (attempt ${attempt})`);
          executionHistoryService.logExecution({
            ruleId: rule.id,
            triggerType: rule.triggerType,
            status: "RETRY",
            retryCount: attempt,
            failureReason: err.message,
          });
        }
      );

      // Log success in history
      const durationMs = Date.now() - startTime;
      await executionHistoryService.logExecution({
        ruleId: rule.id,
        triggerType: rule.triggerType,
        status: "SUCCESS",
        durationMs,
        actionsRun,
      });

      // Update lastRunAt timestamp
      await db.automationRule.update({
        where: { id: rule.id },
        data: { lastRunAt: new Date() },
      });

      automationLogger.info("AutomationExecutor", `Rule ${rule.name} (${rule.id}) executed successfully`);

    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      automationLogger.error("AutomationExecutor", `Failed execution for rule ${rule.id}: ${err.message}`);

      await executionHistoryService.logExecution({
        ruleId: rule.id,
        triggerType: rule.triggerType,
        status: "FAILED",
        durationMs,
        actionsRun,
        failureReason: err.message,
      });
    } finally {
      context.executedRuleIds.delete(rule.id);
    }
  }
}

export const automationExecutor = new AutomationExecutor();
