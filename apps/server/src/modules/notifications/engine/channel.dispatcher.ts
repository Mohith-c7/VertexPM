import { Notification, User } from "@prisma/client";
import { channelRegistry } from "../channels/channel.registry";
import { preferenceService } from "../preferences/preference.service";
import { notificationLogger } from "../logger";
import { DEFAULT_CHANNELS } from "../constants";
import { ChannelName } from "../types";

const LOG_CTX = "ChannelDispatcher";

/**
 * Dispatches a persisted notification to applicable channels
 * based on user preferences and quiet-hour rules.
 */
export class ChannelDispatcher {
  async dispatch(notification: Notification, recipient: User): Promise<void> {
    // Fetch user preferences (global scope)
    const pref = await preferenceService.getPreferences(recipient.id);

    let enabledChannels: ChannelName[];
    let inQuietHours = false;

    if (pref) {
      inQuietHours = preferenceService.isQuietHour(pref);
      enabledChannels = JSON.parse(pref.channels) as ChannelName[];
    } else {
      enabledChannels = DEFAULT_CHANNELS;
    }

    if (inQuietHours) {
      notificationLogger.info(LOG_CTX, "Quiet hours active — suppressing non-urgent channels", {
        recipientId: recipient.id,
        priority: notification.priority,
      });
      // Only allow URGENT through during quiet hours
      if (notification.priority !== "URGENT") {
        enabledChannels = [];
      }
    }

    for (const channelName of enabledChannels) {
      const channel = channelRegistry.get(channelName);
      if (!channel) {
        notificationLogger.warn(LOG_CTX, `Channel not found: ${channelName}`);
        continue;
      }
      if (!channel.supports(notification.type)) {
        notificationLogger.debug(LOG_CTX, `Channel ${channelName} does not support type ${notification.type}`);
        continue;
      }
      try {
        await channel.send(notification, recipient);
        notificationLogger.info(LOG_CTX, `Delivered via ${channelName}`, { notificationId: notification.id });
      } catch (err) {
        notificationLogger.error(LOG_CTX, `Error delivering via ${channelName}`, { error: String(err) });
      }
    }
  }
}

export const channelDispatcher = new ChannelDispatcher();
