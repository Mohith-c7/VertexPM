import { BoardsRepository } from "./boards.repository";
import { CreateBoardInput, UpdateBoardInput, CreateColumnInput, UpdateColumnInput, ReorderColumnsInput } from "@vertexpm/validation";

const repository = new BoardsRepository();

export class BoardsService {
  async createBoard(projectId: string, data: CreateBoardInput, userId: string) {
    const boards = await repository.findBoardsByProjectId(projectId);
    const position = boards.length + 1;
    const board = await repository.createBoard({
      projectId,
      ...data,
      createdById: userId,
      position,
    });
    return board;
  }

  async getBoards(projectId: string) {
    return repository.findBoardsByProjectId(projectId);
  }

  async getBoardById(id: string) {
    const board = await repository.findBoardById(id);
    if (!board) throw new Error("Not found");
    return board;
  }

  async updateBoard(id: string, data: UpdateBoardInput) {
    const board = await repository.findBoardById(id);
    if (!board) throw new Error("Not found");
    return repository.updateBoard(id, data);
  }

  async deleteBoard(id: string) {
    const board = await repository.findBoardById(id);
    if (!board) throw new Error("Not found");
    return repository.deleteBoard(id);
  }

  async createColumn(boardId: string, data: CreateColumnInput) {
    const count = await repository.getColumnsCount(boardId);
    const position = count + 1;
    return repository.createColumn(boardId, { ...data, position });
  }

  async getColumns(boardId: string) {
    return repository.findColumnsByBoardId(boardId);
  }

  async updateColumn(id: string, data: UpdateColumnInput) {
    const column = await repository.findColumnById(id);
    if (!column) throw new Error("Not found");
    return repository.updateColumn(id, data);
  }

  async deleteColumn(id: string) {
    const column = await repository.findColumnById(id);
    if (!column) throw new Error("Not found");
    
    await repository.deleteColumn(id);
    const remaining = await repository.findColumnsByBoardId(column.boardId);
    const updates = remaining.map((col, index) => ({ id: col.id, position: index + 1 }));
    if (updates.length > 0) {
      await repository.updateColumnsPosition(updates);
    }
    return true;
  }

  async reorderColumns(boardId: string, data: ReorderColumnsInput) {
    const columns = await repository.findColumnsByBoardId(boardId);
    const existingIds = new Set(columns.map(c => c.id));
    
    const updates = data.columns;
    if (!updates.every(u => existingIds.has(u.id))) {
      throw new Error("Invalid column ids for this board");
    }
    
    const sortedUpdates = [...updates].sort((a, b) => a.position - b.position);
    const finalUpdates = sortedUpdates.map((u, index) => ({
      id: u.id,
      position: index + 1
    }));
    
    await repository.updateColumnsPosition(finalUpdates);
    return repository.findColumnsByBoardId(boardId);
  }
}
