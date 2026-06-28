import { INotificationChannel } from "./channel.interface";
import { inAppChannel } from "./inapp.channel";
import { browserChannel } from "./browser.channel";
import { notificationLogger } from "../logger";

const LOG_CTX = "ChannelRegistry";

/**
 * Registry that holds all known channels.
 * Channels can be retrieved by name for targeted dispatch.
 */
export class ChannelRegistry {
  private channels: Map<string, INotificationChannel> = new Map();

  constructor() {
    this.register(inAppChannel);
    this.register(browserChannel);
  }

  register(channel: INotificationChannel): void {
    notificationLogger.info(LOG_CTX, `Registering channel: ${channel.name}`);
    this.channels.set(channel.name, channel);
  }

  get(name: string): INotificationChannel | undefined {
    return this.channels.get(name);
  }

  getAll(): INotificationChannel[] {
    return Array.from(this.channels.values());
  }

  has(name: string): boolean {
    return this.channels.has(name);
  }
}

export const channelRegistry = new ChannelRegistry();
