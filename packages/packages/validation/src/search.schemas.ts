import { z } from "zod";

export const SearchType = z.enum([
  "workspace",
  "project",
  "board",
  "column",
  "workitem",
  "comment",
  "user",
  "label",
  "activity",
]);

export const GlobalSearchQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  type: z.union([SearchType, z.array(SearchType)]).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
  workspaceId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  boardId: z.string().uuid().optional(),
});

export type GlobalSearchQuery = z.infer<typeof GlobalSearchQuerySchema>;

export const SearchSuggestionsQuerySchema = z.object({
  q: z.string().min(1, "Search query is required"),
  limit: z.coerce.number().int().min(1).max(20).optional().default(5),
  workspaceId: z.string().uuid().optional(),
});

export type SearchSuggestionsQuery = z.infer<typeof SearchSuggestionsQuerySchema>;

export const CreateSavedSearchSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  query: z.string().min(1, "Query is required"),
  filters: z.record(z.string(), z.any()).optional(),
  type: SearchType.optional(),
});

export type CreateSavedSearch = z.infer<typeof CreateSavedSearchSchema>;

export const UpdateSavedSearchSchema = CreateSavedSearchSchema.partial();

export type UpdateSavedSearch = z.infer<typeof UpdateSavedSearchSchema>;
