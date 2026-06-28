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
