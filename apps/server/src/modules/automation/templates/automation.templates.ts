export interface BuiltInTemplate {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  triggerConfig: any;
  conditions: any[];
  actions: any[];
}

export const BUILT_IN_TEMPLATES: BuiltInTemplate[] = [
  {
    id: "template-task-assigned-notify",
    name: "Task Assigned → Notify Assignee",
    description: "Notify the assignee immediately when a work item is assigned to them.",
    triggerType: "WORKITEM_ASSIGNED",
    triggerConfig: {},
    conditions: [],
    actions: [
      {
        type: "CREATE_NOTIFICATION",
        config: {
          recipientId: "assignee",
          title: "New Task Assigned",
          body: 'You have been assigned to: "{entityTitle}".',
        },
      },
    ],
  },
  {
    id: "template-task-completed-move-notify",
    name: "Task Completed → Notify Reporter & Log Activity",
    description: "When a task is completed, notify the reporter and create an activity log entry.",
    triggerType: "WORKITEM_COMPLETED",
    triggerConfig: {},
    conditions: [
      {
        type: "STATUS_EQUALS",
        config: { status: "DONE" },
      },
    ],
    actions: [
      {
        type: "CREATE_NOTIFICATION",
        config: {
          recipientId: "reporter",
          title: "Task Completed",
          body: 'The task "{entityTitle}" has been completed.',
        },
      },
      {
        type: "CREATE_ACTIVITY",
        config: {
          eventType: "STATUS_CHANGED",
          newValue: "DONE",
        },
      },
    ],
  },
  {
    id: "template-due-tomorrow-reminder",
    name: "Due Tomorrow → Send Reminder",
    description: "Send an in-app reminder notification to the assignee 1 day before the task due date.",
    triggerType: "DUE_DATE_REACHED",
    triggerConfig: { remindBeforeHours: 24 },
    conditions: [],
    actions: [
      {
        type: "CREATE_NOTIFICATION",
        config: {
          recipientId: "assignee",
          title: "Task Due Tomorrow",
          body: 'Your task "{entityTitle}" is due tomorrow.',
        },
      },
    ],
  },
  {
    id: "template-overdue-reminder",
    name: "Overdue → Send Reminder to Assignee",
    description: "Send a reminder to the assignee as soon as a task is overdue.",
    triggerType: "DUE_DATE_REACHED",
    triggerConfig: { overdue: true },
    conditions: [],
    actions: [
      {
        type: "CREATE_NOTIFICATION",
        config: {
          recipientId: "assignee",
          title: "Task Overdue!",
          body: 'Your task "{entityTitle}" is overdue.',
        },
      },
      {
        type: "SCHEDULE_REMINDER",
        config: {
          type: "OVERDUE",
          message: 'Task "{entityTitle}" is overdue!',
          userId: "assignee",
          delayMinutes: 0,
        },
      },
    ],
  },
];
