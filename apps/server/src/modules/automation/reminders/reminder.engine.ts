import { db } from "../../../db.js";
import { notificationDispatcher } from "../../notifications/dispatcher/notification.dispatcher.js";
import { automationLogger } from "../logger/index.js";

export class ReminderEngine {
  async processDueReminders(): Promise<void> {
    automationLogger.info("ReminderEngine", "Processing due reminders");
    try {
      const now = new Date();
      const dueReminders = await db.reminder.findMany({
        where: {
          remindAt: { lte: now },
          isCompleted: false,
        },
      });

      automationLogger.info("ReminderEngine", `Found ${dueReminders.length} due reminders`);

      for (const reminder of dueReminders) {
        // Dispatch in-app notification
        const event = {
          type: "REMINDER",
          actorId: undefined,
          entityId: reminder.entityId || reminder.id,
          entityType: reminder.entityType || "Reminder",
          metadata: {
            reminderId: reminder.id,
            message: reminder.message,
            type: reminder.type,
          },
        };

        await notificationDispatcher.dispatch(event as any, [reminder.userId]);

        // Mark reminder as completed
        await db.reminder.update({
          where: { id: reminder.id },
          data: { isCompleted: true },
        });

        automationLogger.info("ReminderEngine", `Processed reminder ${reminder.id} for user ${reminder.userId}`);
      }
    } catch (err) {
      automationLogger.error("ReminderEngine", "Error processing due reminders", { error: String(err) });
    }
  }
}

export const reminderEngine = new ReminderEngine();
