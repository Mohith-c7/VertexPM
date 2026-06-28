import axios from 'axios';
import { WorkItem, Comment, Activity, Attachment, Dependency } from '../types';

const api = axios.create({
  baseURL: '/api', // Assuming standard REST API route setup
});

export const workItemsApi = {
  getWorkItem: async (id: string): Promise<WorkItem> => {
    const res = await api.get(`/work-items/${id}`);
    return res.data;
  },
  updateWorkItem: async (id: string, data: Partial<WorkItem>): Promise<WorkItem> => {
    const res = await api.patch(`/work-items/${id}`, data);
    return res.data;
  },
  getComments: async (workItemId: string): Promise<Comment[]> => {
    const res = await api.get(`/work-items/${workItemId}/comments`);
    return res.data;
  },
  addComment: async (workItemId: string, content: string): Promise<Comment> => {
    const res = await api.post(`/work-items/${workItemId}/comments`, { content });
    return res.data;
  },
  getActivity: async (workItemId: string): Promise<Activity[]> => {
    const res = await api.get(`/work-items/${workItemId}/activity`);
    return res.data;
  },
  getAttachments: async (workItemId: string): Promise<Attachment[]> => {
    const res = await api.get(`/work-items/${workItemId}/attachments`);
    return res.data;
  },
  uploadAttachment: async (workItemId: string, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/work-items/${workItemId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  getDependencies: async (workItemId: string): Promise<Dependency[]> => {
    const res = await api.get(`/work-items/${workItemId}/dependencies`);
    return res.data;
  },
};
