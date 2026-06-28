import type { GlobalSearchQuery } from "@vertexpm/validation";
import type { SearchResponse } from "../types";

export interface SearchProvider {
  search(query: GlobalSearchQuery): Promise<SearchResponse>;
  suggestions(query: string, workspaceId?: string, limit?: number): Promise<string[]>;
}
