import { db } from "../../db";
import { BoardType, Visibility } from "@prisma/client";

export class BoardsRepository {
  async createBoard(data: { projectId: string; name: string; description?: string; icon?: string; color?: string; boardType?: string; visibility?: string; createdById: string; position?: number }) {
    return db.board.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        boardType: data.boardType as BoardType | undefined,
        visibility: data.visibility as Visibility | undefined,
        createdById: data.createdById,
        position: data.position || 0,
        columns: {
          create: [
            { name: "To Do", position: 1 },
            { name: "In Progress", position: 2 },
            { name: "Done", position: 3, isCompletedColumn: true }
          ]
        }
      },
    });
  }

  async findBoardsByProjectId(projectId: string) {
    return db.board.findMany({
      where: { projectId, isArchived: false, deletedAt: null },
      orderBy: { position: 'asc' }
    });
  }

  async findBoardById(id: string) {
    return db.board.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async updateBoard(id: string, data: any) {
    return db.board.update({
      where: { id },
      data,
    });
  }

  async deleteBoard(id: string) {
    return db.board.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createColumn(boardId: string, data: { name: string; description?: string; color?: string; wipLimit?: number; isCompletedColumn?: boolean; position: number }) {
    return db.column.create({
      data: {
        boardId,
        ...data,
      },
    });
  }

  async findColumnsByBoardId(boardId: string) {
    return db.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
    });
  }
  
  async findColumnById(id: string) {
    return db.column.findUnique({
      where: { id },
    });
  }

  async updateColumn(id: string, data: any) {
    return db.column.update({
      where: { id },
      data,
    });
  }

  async deleteColumn(id: string) {
    return db.column.delete({
      where: { id },
    });
  }
  
  async getColumnsCount(boardId: string) {
    return db.column.count({
      where: { boardId }
    });
  }

  async updateColumnsPosition(updates: { id: string; position: number }[]) {
    const transaction = updates.map(u => 
      db.column.update({
        where: { id: u.id },
        data: { position: u.position }
      })
    );
    return db.$transaction(transaction);
  }
}
