import { api } from '@/lib/api';
import { Project, CreateProjectInput, UpdateProjectInput } from './types';

export const projectService = {
  getProjects: async (workspaceId: string): Promise<Project[]> => {
    const response = await api.get(`/workspaces/${workspaceId}/projects`);
    return response.data;
  },

  getProject: async (workspaceId: string, projectId: string): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  createProject: async (workspaceId: string, data: CreateProjectInput): Promise<Project> => {
    const response = await api.post(`/projects`, { ...data, workspaceId });
    return response.data;
  },

  updateProject: async (workspaceId: string, projectId: string, data: UpdateProjectInput): Promise<Project> => {
    const response = await api.patch(`/projects/${projectId}`, data);
    return response.data;
  },

  deleteProject: async (workspaceId: string, projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  }
};
