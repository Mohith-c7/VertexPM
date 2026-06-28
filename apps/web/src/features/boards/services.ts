import { api } from '@/lib/api';
import { Board, CreateBoardInput, UpdateBoardInput, Column, CreateColumnInput, UpdateColumnInput, WorkItem, UpdateWorkItemInput } from './types';

export const boardService = {
  getBoards: async (workspaceId: string, projectId: string): Promise<Board[]> => {
    const response = await api.get(`/projects/${projectId}/boards`);
    return response.data;
  },

  getBoard: async (workspaceId: string, projectId: string, boardId: string): Promise<Board> => {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  },

  createBoard: async (workspaceId: string, projectId: string, data: CreateBoardInput): Promise<Board> => {
    const response = await api.post(`/projects/${projectId}/boards`, data);
    return response.data;
  },

  updateBoard: async (workspaceId: string, projectId: string, boardId: string, data: UpdateBoardInput): Promise<Board> => {
    const response = await api.patch(`/boards/${boardId}`, data);
    return response.data;
  },

  deleteBoard: async (workspaceId: string, projectId: string, boardId: string): Promise<void> => {
    await api.delete(`/boards/${boardId}`);
  },

  // Column operations
  createColumn: async (workspaceId: string, projectId: string, boardId: string, data: CreateColumnInput): Promise<Column> => {
    const response = await api.post(`/boards/${boardId}/columns`, data);
    return response.data;
  },

  updateColumn: async (workspaceId: string, projectId: string, boardId: string, columnId: string, data: UpdateColumnInput): Promise<Column> => {
    const response = await api.patch(`/columns/${columnId}`, data);
    return response.data;
  },

  deleteColumn: async (workspaceId: string, projectId: string, boardId: string, columnId: string): Promise<void> => {
    await api.delete(`/columns/${columnId}`);
  },

  // WorkItem operations
  getWorkItems: async (boardId: string): Promise<WorkItem[]> => {
    const response = await api.get(`/boards/${boardId}/work-items`);
    return response.data;
  },

  updateWorkItemStatus: async (workItemId: string, data: UpdateWorkItemInput): Promise<WorkItem> => {
    const response = await api.patch(`/work-items/${workItemId}/status`, data);
    return response.data;
  }
};
