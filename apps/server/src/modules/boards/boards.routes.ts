import type { FastifyInstance } from "fastify";
import { 
  createBoardHandler, 
  getBoardsHandler, 
  getBoardByIdHandler, 
  updateBoardHandler, 
  deleteBoardHandler,
  createColumnHandler,
  getColumnsHandler,
  updateColumnHandler,
  deleteColumnHandler,
  reorderColumnsHandler
} from "./boards.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function boardsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  // Board routes (mounted on /api)
  app.post("/projects/:projectId/boards", createBoardHandler);
  app.get("/projects/:projectId/boards", getBoardsHandler);
  
  app.get("/boards/:id", getBoardByIdHandler);
  app.patch("/boards/:id", updateBoardHandler);
  app.delete("/boards/:id", deleteBoardHandler);

  // Column routes
  app.post("/boards/:boardId/columns", createColumnHandler);
  app.get("/boards/:boardId/columns", getColumnsHandler);
  app.post("/boards/:boardId/columns/reorder", reorderColumnsHandler);
  
  app.patch("/columns/:id", updateColumnHandler);
  app.delete("/columns/:id", deleteColumnHandler);
}
