import { db } from "../../../db.js";
import { triggerResolver } from "../triggers/trigger.resolver.js";
import { automationExecutor } from "./automation.executor.js";
import { AutomationContext, AutomationRule } from "../types/index.js";
import { automationLogger } from "../logger/index.js";

export class AutomationDispatcher {
  async dispatchEvent(event: any): Promise<void> {
    automationLogger.debug("AutomationDispatcher", `Dispatching event type: ${event.type}`, { event });

    const workspaceId = event.workspaceId;
    if (!workspaceId) {
      automationLogger.warn("AutomationDispatcher", "Event is missing workspaceId, skipping automation dispatcher evaluation", { event });
      return;
    }

    // Load all active rules in this workspace
    const rules = await db.automationRule.findMany({
      where: {
        workspaceId,
        isEnabled: true,
      },
    });

    automationLogger.debug("AutomationDispatcher", `Loaded ${rules.length} enabled rules for workspace: ${workspaceId}`);

    const matchingRules: AutomationRule[] = [];
    for (const rule of rules) {
      // Verify project scope compatibility
      if (rule.projectId && rule.projectId !== event.projectId) {
        continue;
      }

      // Check if trigger matches the event
      const config = rule.triggerConfig ? JSON.parse(rule.triggerConfig) : undefined;
      const matches = await triggerResolver.resolve(rule.triggerType as any, event, config);
      if (matches) {
        matchingRules.push(rule);
      }
    }

    if (matchingRules.length === 0) {
      automationLogger.debug("AutomationDispatcher", `No matching rules found for event: ${event.type}`);
      return;
    }

    automationLogger.info("AutomationDispatcher", `Triggering ${matchingRules.length} rules for event: ${event.type}`);

    // Create execution context
    const context: AutomationContext = {
      depth: 1,
      executedRuleIds: new Set(),
      actorId: event.actorId,
      eventTimestamp: Date.now(),
      triggerEvent: event,
    };

    // Run matching rules
    for (const rule of matchingRules) {
      // Isolate rule branch set to allow execution of other rules
      const ruleCtx: AutomationContext = {
        ...context,
        executedRuleIds: new Set(context.executedRuleIds),
      };

      automationExecutor
        .executeRule(rule, event.entityId, event.entityType, ruleCtx)
        .catch((err) => {
          automationLogger.error("AutomationDispatcher", `Error executing rule ${rule.id}`, { error: String(err) });
        });
    }
  }
}

export const automationDispatcher = new AutomationDispatcher();
