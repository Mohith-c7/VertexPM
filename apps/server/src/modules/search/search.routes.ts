import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  globalSearchHandler,
  suggestionsHandler,
  getHistoryHandler,
  clearHistoryHandler,
  getSavedSearchesHandler,
  createSavedSearchHandler,
  updateSavedSearchHandler,
  deleteSavedSearchHandler
} from "./search.controller";

export async function searchRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.get("/", globalSearchHandler);
  app.get("/suggestions", suggestionsHandler);
  
  app.get("/history", getHistoryHandler);
  app.delete("/history", clearHistoryHandler);

  app.get("/saved", getSavedSearchesHandler);
  app.post("/saved", createSavedSearchHandler);
  app.patch("/saved/:id", updateSavedSearchHandler);
  app.delete("/saved/:id", deleteSavedSearchHandler);
}
