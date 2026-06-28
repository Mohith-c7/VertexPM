import type { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { SearchEngine } from "./engine/search.engine";
import { PostgresSearchProvider } from "./engine/postgres.provider";
import { RankingEngine } from "./ranking/ranking.engine";
import { QueryParser } from "./parser/query.parser";
import { SearchHistoryService } from "./history/history.service";
import { SavedSearchService } from "./saved-search/saved-search.service";
import {
  GlobalSearchQuerySchema,
  SearchSuggestionsQuerySchema,
  CreateSavedSearchSchema,
  UpdateSavedSearchSchema
} from "@vertexpm/validation";

const prisma = new PrismaClient();
const searchProvider = new PostgresSearchProvider(prisma);
const searchEngine = new SearchEngine(searchProvider);
const rankingEngine = new RankingEngine();
const queryParser = new QueryParser();
const historyService = new SearchHistoryService(prisma);
const savedSearchService = new SavedSearchService(prisma);

export async function globalSearchHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const rawQuery = GlobalSearchQuerySchema.parse(req.query);
    const parsedQuery = queryParser.parse(rawQuery);
    
    const results = await searchEngine.search(parsedQuery);
    const rankedResults = rankingEngine.rankResults(results);

    // If it's a user search and workspace is provided, record history
    const user = (req as any).user;
    if (user?.id && parsedQuery.workspaceId) {
      // fire and forget history saving
      historyService.addHistory(user.id, parsedQuery.workspaceId, parsedQuery.q, parsedQuery).catch(console.error);
    }

    return reply.send(rankedResults);
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function suggestionsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = SearchSuggestionsQuerySchema.parse(req.query);
    const suggestions = await searchEngine.getSuggestions(query.q, query.workspaceId, query.limit);
    return reply.send({ suggestions });
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function getHistoryHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const workspaceId = (req.query as any).workspaceId;
    if (!workspaceId) throw new Error("workspaceId is required");
    
    const history = await historyService.getHistory(user.id, workspaceId);
    return reply.send({ history });
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function clearHistoryHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const workspaceId = (req.query as any).workspaceId;
    if (!workspaceId) throw new Error("workspaceId is required");
    
    await historyService.clearHistory(user.id, workspaceId);
    return reply.send({ success: true });
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function getSavedSearchesHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const workspaceId = (req.query as any).workspaceId;
    if (!workspaceId) throw new Error("workspaceId is required");

    const saved = await savedSearchService.getSavedSearches(user.id, workspaceId);
    return reply.send({ savedSearches: saved });
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function createSavedSearchHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const workspaceId = (req.body as any).workspaceId;
    if (!workspaceId) throw new Error("workspaceId is required in body");

    const data = CreateSavedSearchSchema.parse(req.body);
    const saved = await savedSearchService.createSavedSearch(user.id, workspaceId, data);
    return reply.status(201).send(saved);
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function updateSavedSearchHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const { id } = req.params as any;
    
    const data = UpdateSavedSearchSchema.parse(req.body);
    const saved = await savedSearchService.updateSavedSearch(user.id, id, data);
    return reply.send(saved);
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}

export async function deleteSavedSearchHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    const { id } = req.params as any;

    await savedSearchService.deleteSavedSearch(user.id, id);
    return reply.send({ success: true });
  } catch (error: any) {
    req.log.error(error);
    return reply.status(400).send({ error: error.message });
  }
}
