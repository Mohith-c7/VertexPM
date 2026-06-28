import axios from 'axios';
import { FilterQueryDto, SavedFilter } from '../types';

const API_BASE = '/api/filters';

export const FilterService = {
  async queryItems(dto: FilterQueryDto) {
    const response = await axios.post(`${API_BASE}/query`, dto);
    return response.data;
  },

  async getSavedFilters(): Promise<SavedFilter[]> {
    const response = await axios.get(`${API_BASE}/saved`);
    return response.data;
  },

  async saveFilter(filter: Partial<SavedFilter>): Promise<SavedFilter> {
    const response = await axios.post(`${API_BASE}/saved`, filter);
    return response.data;
  },

  async updateSavedFilter(id: string, filter: Partial<SavedFilter>): Promise<SavedFilter> {
    const response = await axios.put(`${API_BASE}/saved/${id}`, filter);
    return response.data;
  },

  async deleteSavedFilter(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/saved/${id}`);
  },
};
