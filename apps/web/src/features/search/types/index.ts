export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: 'issue' | 'project' | 'document' | 'user' | 'action';
  metadata?: Record<string, any>;
  icon?: string;
}

export interface SearchCategoryData {
  id: string;
  label: string;
  results: SearchResult[];
}

export interface SearchResponse {
  data: SearchCategoryData[];
  meta: {
    total: number;
    took: number;
  };
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  pinned: boolean;
}
