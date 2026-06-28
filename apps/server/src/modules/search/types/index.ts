export interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  url?: string;
  score: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupedSearchResults {
  type: string;
  items: SearchResultItem[];
  total: number;
}

export interface SearchResponse {
  results: GroupedSearchResults[];
  total: number;
  took: number;
}
