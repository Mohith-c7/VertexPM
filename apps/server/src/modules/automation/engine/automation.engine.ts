import { eventSubscriber } from "../../notifications/dispatcher/event.subscriber.js";
import { automationDispatcher } from "./automation.dispatcher.js";
import { automationLogger } from "../logger/index.js";

export class AutomationEngine {
  private static instance: AutomationEngine;
  private isRunning = false;

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  start(): void {
    if (this.isRunning) {
      automationLogger.warn("AutomationEngine", "AutomationEngine is already running");
      return;
    }

    // Connect to notification event subscriber catch-all ("ALL")
    eventSubscriber.on("ALL", async (event) => {
      try {
        await automationDispatcher.dispatchEvent(event);
      } catch (err) {
        automationLogger.error("AutomationEngine", "Error handling event on subscriber callback", { error: String(err), event });
      }
    });

    this.isRunning = true;
    automationLogger.info("AutomationEngine", "AutomationEngine started and subscribed to domain events");
  }
}

export const automationEngine = AutomationEngine.getInstance();
