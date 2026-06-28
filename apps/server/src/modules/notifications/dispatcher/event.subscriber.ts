import { EventEmitter } from "events";
import { DomainEvent, NotificationType } from "../types";
import { notificationLogger } from "../logger";

const LOG_CTX = "EventSubscriber";

type EventHandler = (event: DomainEvent) => Promise<void>;

/**
 * Simple in-process event bus for domain events.
 * Other modules emit events here; EventSubscriber routes them to NotificationDispatcher.
 */
class NotificationEventBus extends EventEmitter {
  private static instance: NotificationEventBus;

  private constructor() {
    super();
    this.setMaxListeners(50);
  }

  static getInstance(): NotificationEventBus {
    if (!NotificationEventBus.instance) {
      NotificationEventBus.instance = new NotificationEventBus();
    }
    return NotificationEventBus.instance;
  }
}

export const notificationEventBus = NotificationEventBus.getInstance();

/**
 * Subscribes to domain events and forwards them to registered handlers.
 * One handler per notification type for clean separation.
 */
export class EventSubscriber {
  private handlers: Map<string, EventHandler[]> = new Map();

  /** Register a handler for a specific event type */
  on(type: NotificationType | "ALL", handler: EventHandler): void {
    const key = type.toString();
    const existing = this.handlers.get(key) ?? [];
    this.handlers.set(key, [...existing, handler]);

    notificationEventBus.on(key, async (event: DomainEvent) => {
      try {
        await handler(event);
      } catch (err) {
        notificationLogger.error(LOG_CTX, `Handler error for event ${key}`, { error: String(err) });
      }
    });

    notificationLogger.debug(LOG_CTX, `Subscribed handler for: ${key}`);
  }

  /** Emit a domain event to all registered handlers */
  emit(event: DomainEvent): void {
    notificationLogger.info(LOG_CTX, `Emitting event: ${event.type}`, { entityId: event.entityId });
    notificationEventBus.emit(event.type.toString(), event);
    // Also emit to "ALL" catch-all listeners
    notificationEventBus.emit("ALL", event);
  }
}

export const eventSubscriber = new EventSubscriber();
