import { db } from "../../../db.js";
import { notificationDispatcher } from "../../notifications/dispatcher/notification.dispatcher.js";
import { notificationEventBus } from "../../notifications/dispatcher/event.subscriber.js";
import { automationLogger } from "../logger/index.js";

import { reminderEngine } from "../reminders/reminder.engine.js";

export interface JobHandler {
  run: (payload?: any) => Promise<void>;
}

export class JobRegistry {
  private static instance: JobRegistry;
  private handlers: Map<string, JobHandler> = new Map();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): JobRegistry {
    if (!JobRegistry.instance) {
      JobRegistry.instance = new JobRegistry();
    }
    return JobRegistry.instance;
  }

  register(jobType: string, handler: JobHandler): void {
    this.handlers.set(jobType, handler);
  }

  get(jobType: string): JobHandler | undefined {
    return this.handlers.get(jobType);
  }

  private registerDefaults(): void {
    // 1. Due Date Reminder
    this.register("due-date-reminder", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running due-date-reminder job");
        
        // Also run custom due reminders
        await reminderEngine.processDueReminders();

        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Find work items due in next 24 hours that are not completed
        const items = await db.workItem.findMany({
          where: {
            dueDate: {
              gte: now,
              lte: tomorrow,
            },
            status: { notIn: ["DONE", "CANCELLED"] },
            isArchived: false,
          },
          include: {
            board: {
              select: { projectId: true },
            },
          },
        });

        automationLogger.info("JobRegistry", `Found ${items.length} items due in next 24h`);

        for (const item of items) {
          // Resolve workspaceId
          const project = await db.project.findUnique({
            where: { id: item.board.projectId },
            select: { workspaceId: true },
          });
          const workspaceId = project?.workspaceId || "";

          // Check if a reminder already exists for this workitem and type
          const existing = await db.reminder.findFirst({
            where: {
              entityId: item.id,
              entityType: "WorkItem",
              type: "DUE_TODAY",
              createdAt: {
                gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // within last 24h
              },
            },
          });

          if (!existing) {
            const userId = item.assigneeId || item.reporterId;
            if (userId) {
              // Create reminder
              await db.reminder.create({
                data: {
                  userId,
                  entityId: item.id,
                  entityType: "WorkItem",
                  type: "DUE_TODAY",
                  message: `Task "${item.title}" is due today!`,
                  remindAt: now,
                },
              });

              // Dispatch notification
              const event = {
                type: "DUE_DATE",
                actorId: undefined,
                entityId: item.id,
                entityType: "WorkItem",
                workspaceId,
                projectId: item.board.projectId,
                metadata: {
                  dueDate: item.dueDate?.toISOString(),
                  assigneeId: userId,
                },
              };
              // Notify assignee
              await notificationDispatcher.dispatch(event as any, [userId]);
            }
          }
        }
      },
    });

    // 2. Overdue Reminder
    this.register("overdue-reminder", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running overdue-reminder job");
        const now = new Date();

        // Find work items with past due date that are not completed
        const items = await db.workItem.findMany({
          where: {
            dueDate: {
              lt: now,
            },
            status: { notIn: ["DONE", "CANCELLED"] },
            isArchived: false,
          },
          include: {
            board: {
              select: { projectId: true },
            },
          },
        });

        automationLogger.info("JobRegistry", `Found ${items.length} overdue items`);

        for (const item of items) {
          const project = await db.project.findUnique({
            where: { id: item.board.projectId },
            select: { workspaceId: true },
          });
          const workspaceId = project?.workspaceId || "";

          // Check if a reminder already exists for this workitem and type
          const existing = await db.reminder.findFirst({
            where: {
              entityId: item.id,
              entityType: "WorkItem",
              type: "OVERDUE",
              createdAt: {
                gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // within last 24h
              },
            },
          });

          if (!existing) {
            const userId = item.assigneeId || item.reporterId;
            if (userId) {
              // Create reminder
              await db.reminder.create({
                data: {
                  userId,
                  entityId: item.id,
                  entityType: "WorkItem",
                  type: "OVERDUE",
                  message: `Task "${item.title}" is OVERDUE!`,
                  remindAt: now,
                },
              });

              // Dispatch notification
              const event = {
                type: "DUE_DATE",
                actorId: undefined,
                entityId: item.id,
                entityType: "WorkItem",
                workspaceId,
                projectId: item.board.projectId,
                metadata: {
                  dueDate: item.dueDate?.toISOString(),
                  assigneeId: userId,
                  isOverdue: "true",
                },
              };
              await notificationDispatcher.dispatch(event as any, [userId]);
            }
          }
        }
      },
    });

    // 3. Daily Digest (Runs at 8 AM)
    this.register("daily-digest", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running daily-digest job");
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find users with daily digest preference
        const preferences = await db.notificationPreference.findMany({
          where: {
            digestFreq: "DAILY",
          },
          select: {
            userId: true,
            workspaceId: true,
          },
        });

        for (const pref of preferences) {
          // Get unread notifications for this user in last 24 hours
          const unreadNotifications = await db.notification.findMany({
            where: {
              recipientId: pref.userId,
              isRead: false,
              createdAt: { gte: twentyFourHoursAgo },
            },
            take: 10,
          });

          if (unreadNotifications.length > 0) {
            // Send daily digest summary notification
            const digestEvent = {
              type: "SYSTEM",
              entityId: pref.userId,
              entityType: "User",
              metadata: {
                title: "Daily Digest Summary",
                body: `You have ${unreadNotifications.length} unread notifications from the last 24 hours.`,
              },
            };
            await notificationDispatcher.dispatch(digestEvent as any, [pref.userId]);
          }
        }
      },
    });

    // 4. Weekly Digest (Runs every Monday 8 AM)
    this.register("weekly-digest", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running weekly-digest job");
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Find users with weekly digest preference
        const preferences = await db.notificationPreference.findMany({
          where: {
            digestFreq: "WEEKLY",
          },
          select: {
            userId: true,
            workspaceId: true,
          },
        });

        for (const pref of preferences) {
          // Get unread notifications for this user in last 7 days
          const unreadNotifications = await db.notification.findMany({
            where: {
              recipientId: pref.userId,
              isRead: false,
              createdAt: { gte: sevenDaysAgo },
            },
            take: 20,
          });

          if (unreadNotifications.length > 0) {
            // Send weekly digest summary notification
            const digestEvent = {
              type: "SYSTEM",
              entityId: pref.userId,
              entityType: "User",
              metadata: {
                title: "Weekly Digest Summary",
                body: `You have ${unreadNotifications.length} unread notifications from the last 7 days.`,
              },
            };
            await notificationDispatcher.dispatch(digestEvent as any, [pref.userId]);
          }
        }
      },
    });

    // 5. Cleanup Notifications (Midnight daily)
    this.register("cleanup-notifications", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running cleanup-notifications job");
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Delete notifications older than 30 days
        const result = await db.notification.deleteMany({
          where: {
            createdAt: { lt: thirtyDaysAgo },
          },
        });

        automationLogger.info("JobRegistry", `Cleaned up ${result.count} old notifications`);
      },
    });

    // 6. Retry Failed Jobs
    this.register("retry-failed-jobs", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running retry-failed-jobs job");

        // Find failed scheduled jobs with remaining retries
        const failedJobs = await db.scheduledJob.findMany({
          where: {
            status: "FAILED",
            retryCount: { lt: db.scheduledJob.fields.maxRetries },
          },
          take: 10,
        });

        automationLogger.info("JobRegistry", `Found ${failedJobs.length} eligible jobs to retry`);

        for (const job of failedJobs) {
          automationLogger.info("JobRegistry", `Retrying job ${job.id} (${job.jobType})`);

          // Reset status to PENDING and trigger execution immediately
          await db.scheduledJob.update({
            where: { id: job.id },
            data: {
              status: "PENDING",
              nextRunAt: new Date(),
            },
          });
        }
      },
    });

    // 7. Health Check
    this.register("health-check", {
      run: async () => {
        automationLogger.info("JobRegistry", "Running health-check job");
        // Verify database connection
        await db.$queryRaw`SELECT 1`;
        automationLogger.info("JobRegistry", "Health check completed successfully: Database ping OK");
      },
    });
  }
}

export const jobRegistry = JobRegistry.getInstance();
