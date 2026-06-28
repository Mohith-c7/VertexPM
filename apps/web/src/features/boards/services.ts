import { api } from '@/lib/api';
import { Board, CreateBoardInput, UpdateBoardInput, Column, CreateColumnInput, UpdateColumnInput } from './types';

export const boardService = {
  getBoards: async (workspaceId: string, projectId: string): Promise<Board[]> => {
    const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/boards`);
    return response.data;
  },

  getBoard: async (workspaceId: string, projectId: string, boardId: string): Promise<Board> => {
    const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`);
    return response.data;
  },

  createBoard: async (workspaceId: string, projectId: string, data: CreateBoardInput): Promise<Board> => {
    const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/boards`, data);
    return response.data;
  },

  updateBoard: async (workspaceId: string, projectId: string, boardId: string, data: UpdateBoardInput): Promise<Board> => {
    const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`, data);
    return response.data;
  },

  deleteBoard: async (workspaceId: string, projectId: string, boardId: string): Promise<void> => {
    await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}`);
  },

  // Column operations
  createColumn: async (workspaceId: string, projectId: string, boardId: string, data: CreateColumnInput): Promise<Column> => {
    const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/columns`, data);
    return response.data;
  },

  updateColumn: async (workspaceId: string, projectId: string, boardId: string, columnId: string, data: UpdateColumnInput): Promise<Column> => {
    const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/columns/${columnId}`, data);
    return response.data;
  },

  deleteColumn: async (workspaceId: string, projectId: string, boardId: string, columnId: string): Promise<void> => {
    await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/boards/${boardId}/columns/${columnId}`);
  }
};
