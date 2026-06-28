import type { SearchResponse, GroupedSearchResults } from "../types";

export class RankingEngine {
  rankResults(response: SearchResponse): SearchResponse {
    // Currently relying on PostgreSQL text search scoring.
    // Future: implement custom boosting, TF-IDF tuning, or ML-based ranking.
    
    // Sort each group's items by score descending
    const rankedResults: GroupedSearchResults[] = response.results.map(group => ({
      ...group,
      items: group.items.sort((a, b) => b.score - a.score)
    }));

    return {
      ...response,
      results: rankedResults
    };
  }
}
