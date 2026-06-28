import { SEARCH_API_ENDPOINT } from '../constants';
import { SearchResponse } from '../types';

export const fetchSearchResults = async (query: string): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { data: [], meta: { total: 0, took: 0 } };
  }
  
  try {
    const response = await fetch(`${SEARCH_API_ENDPOINT}?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching search results:', error);
    // Return empty results on error for now, could be enhanced with proper error handling
    return { data: [], meta: { total: 0, took: 0 } };
  }
};
