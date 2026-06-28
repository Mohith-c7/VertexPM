export type WorkItemStatus = 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done';
export type WorkItemPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type WorkItemType = 'Epic' | 'Story' | 'Task' | 'Bug';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  type: WorkItemType;
  priority: WorkItemPriority;
  status: WorkItemStatus;
  assigneeId?: string;
  assignee?: User;
  reporterId: string;
  reporter?: User;
  labels: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

export interface Comment {
  id: string;
  workItemId: string;
  authorId: string;
  author?: User;
  content: string;
  createdAt: string;
  updatedAt: string;
  threadId?: string; // for threaded comments
}

export interface Activity {
  id: string;
  workItemId: string;
  actorId: string;
  actor?: User;
  action: string; // e.g., "changed status", "assigned to"
  details?: Record<string, any>;
  createdAt: string;
}

export interface Attachment {
  id: string;
  workItemId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedById: string;
  uploadedBy?: User;
  createdAt: string;
}

export interface Dependency {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'blocks' | 'is_blocked_by' | 'relates_to';
  targetWorkItem?: WorkItem;
}
