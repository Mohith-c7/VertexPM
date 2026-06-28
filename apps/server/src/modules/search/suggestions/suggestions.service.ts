import { SearchEngine } from "../engine/search.engine";

export class SuggestionsService {
  constructor(private engine: SearchEngine) {}

  async getSuggestions(query: string, workspaceId?: string, limit?: number) {
    return this.engine.getSuggestions(query, workspaceId, limit);
  }
}
