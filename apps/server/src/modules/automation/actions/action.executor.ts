import { ActionContext } from "./action.types.js";
import { actionRegistry } from "./action.registry.js";
import { AutomationAction } from "../types/index.js";
import { automationLogger } from "../logger/index.js";

export class ActionExecutor {
  async executeAll(actions: AutomationAction[], context: ActionContext): Promise<number> {
    if (!actions || actions.length === 0) {
      return 0;
    }

    automationLogger.debug("ActionExecutor", `Executing ${actions.length} action(s)`, {
      entityId: context.entityId,
      entityType: context.entityType,
    });

    let executedCount = 0;
    for (const action of actions) {
      const handler = actionRegistry.get(action.type);
      if (!handler) {
        automationLogger.warn("ActionExecutor", `No handler registered for action type: ${action.type}`);
        continue;
      }

      try {
        await handler.execute(context, action.config);
        executedCount++;
        automationLogger.debug("ActionExecutor", `Action ${action.type} executed successfully`);
      } catch (err) {
        automationLogger.error("ActionExecutor", `Error executing action ${action.type}`, {
          error: String(err),
          config: action.config,
        });
        throw err; // Propagate error for execution logger and retry logic
      }
    }

    return executedCount;
  }
}

export const actionExecutor = new ActionExecutor();
