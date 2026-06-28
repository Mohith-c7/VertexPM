import { TriggerType } from "../types";
import { TriggerHandler } from "./trigger.types";

export class TriggerRegistry {
  private static instance: TriggerRegistry;
  private handlers: Map<TriggerType, TriggerHandler> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): TriggerRegistry {
    if (!TriggerRegistry.instance) {
      TriggerRegistry.instance = new TriggerRegistry();
    }
    return TriggerRegistry.instance;
  }

  register(handler: TriggerHandler): void {
    this.handlers.set(handler.type, handler);
  }

  get(type: TriggerType): TriggerHandler | undefined {
    return this.handlers.get(type);
  }

  private registerDefaults(): void {
    // Standard triggers that match the event type or specialized conditions
    const simpleTriggers: TriggerType[] = [
      "WORKITEM_CREATED",
      "WORKITEM_UPDATED",
      "WORKITEM_ASSIGNED",
      "WORKITEM_COMPLETED",
      "WORKITEM_DELETED",
      "COMMENT_ADDED",
      "REPLY_ADDED",
      "MENTION_CREATED",
      "DUE_DATE_REACHED",
      "REMINDER_TIME",
      "SCHEDULE",
      "BOARD_CREATED",
      "PROJECT_UPDATED",
    ];

    for (const type of simpleTriggers) {
      this.register({
        type,
        matches: (event: any, ruleConfig?: any) => {
          // If the event type directly matches the trigger type, it's a match!
          if (event.type === type) {
            return true;
          }

          // Fallback mappings from standard NotificationTypes/DomainEvents
          if (type === "WORKITEM_ASSIGNED" && event.type === "ASSIGNMENT") {
            return true;
          }
          if (type === "COMMENT_ADDED" && event.type === "COMMENT") {
            return true;
          }
          if (type === "REPLY_ADDED" && event.type === "REPLY") {
            return true;
          }
          if (type === "MENTION_CREATED" && event.type === "MENTION") {
            return true;
          }
          if (type === "PROJECT_UPDATED" && event.type === "PROJECT_UPDATE") {
            return true;
          }
          if (type === "WORKITEM_COMPLETED" && event.type === "STATUS_CHANGE" && event.metadata?.newValue === "DONE") {
            return true;
          }
          if (type === "WORKITEM_UPDATED" && (event.type === "STATUS_CHANGE" || event.type === "PRIORITY_CHANGE" || event.type === "DUE_DATE")) {
            return true;
          }

          return false;
        },
      });
    }
  }
}

export const triggerRegistry = TriggerRegistry.getInstance();
