export class SearchLogger {
  // Stub for search logging
  logQuery(query: string, tookMs: number, resultCount: number) {
    console.log(`[Search] Query: ${query} | Took: ${tookMs}ms | Results: ${resultCount}`);
  }
}
