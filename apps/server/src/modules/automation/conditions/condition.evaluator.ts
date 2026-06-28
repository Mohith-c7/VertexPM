import { ConditionContext } from "./condition.types.js";
import { conditionRegistry } from "./condition.registry.js";
import { AutomationCondition } from "../types/index.js";
import { automationLogger } from "../logger/index.js";

export class ConditionEvaluator {
  async evaluateAll(conditions: AutomationCondition[], context: ConditionContext): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true;
    }

    automationLogger.debug("ConditionEvaluator", `Evaluating ${conditions.length} conditions`, {
      entityId: context.entityId,
      entityType: context.entityType,
    });

    for (const cond of conditions) {
      const handler = conditionRegistry.get(cond.type);
      if (!handler) {
        automationLogger.warn("ConditionEvaluator", `No handler registered for condition type: ${cond.type}`);
        return false;
      }
      try {
        const matches = await handler.evaluate(context, cond.config);
        if (!matches) {
          automationLogger.debug("ConditionEvaluator", `Condition ${cond.type} failed`, { config: cond.config });
          return false;
        }
      } catch (err) {
        automationLogger.error("ConditionEvaluator", `Error evaluating condition ${cond.type}`, {
          error: String(err),
          config: cond.config,
        });
        return false;
      }
    }

    automationLogger.debug("ConditionEvaluator", "All conditions passed successfully");
    return true;
  }
}

export const conditionEvaluator = new ConditionEvaluator();
