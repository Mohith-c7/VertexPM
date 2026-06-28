import { db } from "../../../db.js";
import { automationLogger } from "../logger/index.js";
import { Reminder } from "../types/index.js";

export class ReminderScheduler {
  async scheduleReminder(data: {
    userId: string;
    entityId?: string | null;
    entityType?: string | null;
    type: "DUE_TODAY" | "OVERDUE" | "CUSTOM";
    message: string;
    remindAt: Date;
  }): Promise<Reminder> {
    automationLogger.info("ReminderScheduler", `Scheduling reminder for user ${data.userId} at ${data.remindAt}`);
    return await db.reminder.create({
      data: {
        userId: data.userId,
        entityId: data.entityId || null,
        entityType: data.entityType || null,
        type: data.type,
        message: data.message,
        remindAt: data.remindAt,
      },
    });
  }

  async getReminders(filters: {
    userId?: string;
    entityId?: string;
    entityType?: string;
  }): Promise<Reminder[]> {
    return await db.reminder.findMany({
      where: {
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.entityId ? { entityId: filters.entityId } : {}),
        ...(filters.entityType ? { entityType: filters.entityType } : {}),
        isCompleted: false,
      },
      orderBy: { remindAt: "asc" },
    });
  }

  async deleteReminder(id: string, userId: string): Promise<void> {
    automationLogger.info("ReminderScheduler", `Deleting reminder ${id} by user ${userId}`);
    
    // Ensure the reminder belongs to the user
    const reminder = await db.reminder.findUnique({ where: { id } });
    if (!reminder) {
      throw new Error(`Reminder ${id} not found`);
    }
    if (reminder.userId !== userId) {
      throw new Error("Unauthorized to delete this reminder");
    }

    await db.reminder.delete({
      where: { id },
    });
  }
}

export const reminderScheduler = new ReminderScheduler();
