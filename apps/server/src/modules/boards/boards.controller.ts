import { FastifyReply, FastifyRequest } from "fastify";
import { BoardsService } from "./boards.service";
import { 
  createBoardSchema, 
  updateBoardSchema, 
  boardIdParamSchema,
  projectIdParamSchema,
  createColumnSchema,
  updateColumnSchema,
  columnIdParamSchema,
  columnBoardIdParamSchema,
  reorderColumnsSchema
} from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

const service = new BoardsService();

// Boards
export async function createBoardHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = projectIdParamSchema.parse(req.params);
    const body = createBoardSchema.parse(req.body);
    const board = await service.createBoard(params.projectId, body, (req as any).user.id);
    return reply.status(201).send(successResponse("Board created successfully", board));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getBoardsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = projectIdParamSchema.parse(req.params);
    const boards = await service.getBoards(params.projectId);
    return reply.status(200).send(successResponse("Boards fetched successfully", boards));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getBoardByIdHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = boardIdParamSchema.parse(req.params);
    const board = await service.getBoardById(params.id);
    return reply.status(200).send(successResponse("Board fetched successfully", board));
  } catch (error: any) {
    return reply.status(404).send(errorResponse(error.message, "NOT_FOUND", error));
  }
}

export async function updateBoardHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = boardIdParamSchema.parse(req.params);
    const body = updateBoardSchema.parse(req.body);
    const board = await service.updateBoard(params.id, body);
    return reply.status(200).send(successResponse("Board updated successfully", board));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function deleteBoardHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = boardIdParamSchema.parse(req.params);
    await service.deleteBoard(params.id);
    return reply.status(200).send(successResponse("Board deleted successfully"));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

// Columns
export async function createColumnHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = columnBoardIdParamSchema.parse(req.params);
    const body = createColumnSchema.parse(req.body);
    const column = await service.createColumn(params.boardId, body);
    return reply.status(201).send(successResponse("Column created successfully", column));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getColumnsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = columnBoardIdParamSchema.parse(req.params);
    const columns = await service.getColumns(params.boardId);
    return reply.status(200).send(successResponse("Columns fetched successfully", columns));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function updateColumnHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = columnIdParamSchema.parse(req.params);
    const body = updateColumnSchema.parse(req.body);
    const column = await service.updateColumn(params.id, body);
    return reply.status(200).send(successResponse("Column updated successfully", column));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function deleteColumnHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = columnIdParamSchema.parse(req.params);
    await service.deleteColumn(params.id);
    return reply.status(200).send(successResponse("Column deleted successfully"));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function reorderColumnsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = columnBoardIdParamSchema.parse(req.params);
    const body = reorderColumnsSchema.parse(req.body);
    const columns = await service.reorderColumns(params.boardId, body);
    return reply.status(200).send(successResponse("Columns reordered successfully", columns));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}
