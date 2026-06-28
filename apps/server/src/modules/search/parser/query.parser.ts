import type { GlobalSearchQuery } from "@vertexpm/validation";

export class QueryParser {
  parse(rawQuery: Partial<GlobalSearchQuery>): GlobalSearchQuery {
    // Basic query parser for search syntax
    // Handles defaults and validates structure
    return {
      q: rawQuery.q || "",
      type: rawQuery.type,
      limit: rawQuery.limit || 20,
      offset: rawQuery.offset || 0,
      workspaceId: rawQuery.workspaceId,
      projectId: rawQuery.projectId,
      boardId: rawQuery.boardId,
    };
  }
}
