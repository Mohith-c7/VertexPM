export interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

export interface Board {
  id: string;
  name: string;
  projectId: string;
  columns?: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardInput {
  name: string;
}

export interface UpdateBoardInput {
  name?: string;
}

export interface CreateColumnInput {
  name: string;
}

export interface UpdateColumnInput {
  name?: string;
  order?: number;
}

export type WorkItemType = 'epic' | 'story' | 'task' | 'bug';
export type WorkItemPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkItem {
  id: string;
  title: string;
  type: WorkItemType;
  priority: WorkItemPriority;
  statusId: string; // references column id
  boardId: string;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  labels?: {
    id: string;
    name: string;
    color: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateWorkItemInput {
  statusId?: string;
}
