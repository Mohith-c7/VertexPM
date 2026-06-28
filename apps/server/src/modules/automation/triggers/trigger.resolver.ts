import { TriggerType } from "../types";
import { triggerRegistry } from "./trigger.registry.js";

export class TriggerResolver {
  async resolve(triggerType: TriggerType, event: any, triggerConfig?: any): Promise<boolean> {
    const handler = triggerRegistry.get(triggerType);
    if (!handler) {
      return false;
    }
    try {
      const matchResult = await handler.matches(event, triggerConfig);
      return !!matchResult;
    } catch {
      return false;
    }
  }
}

export const triggerResolver = new TriggerResolver();
