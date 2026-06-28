import type { SearchProvider } from "./provider.interface";
import type { GlobalSearchQuery } from "@vertexpm/validation";
import type { SearchResponse } from "../types";

export class SearchEngine {
  constructor(private provider: SearchProvider) {}

  async search(query: GlobalSearchQuery): Promise<SearchResponse> {
    return this.provider.search(query);
  }

  async getSuggestions(query: string, workspaceId?: string, limit?: number): Promise<string[]> {
    return this.provider.suggestions(query, workspaceId, limit);
  }
}
