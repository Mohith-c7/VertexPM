import { db } from "../../../db";

export interface ContextOptions {
  workspaceId: string;
  projectId?: string;
  boardId?: string;
  workItemId?: string;
  userId: string;
}

export class ContextBuilder {
  static async buildContext(options: ContextOptions): Promise<string> {
    const { workspaceId, projectId, boardId, workItemId, userId } = options;

    // RBAC: Verify user is a member of the workspace
    const member = await db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!member) {
      throw new Error("Unauthorized access to workspace");
    }

    let contextString = "Context provided:\n";

    // 1. Fetch Workspace Context
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true, description: true },
    });
    if (workspace) {
      contextString += `Workspace: ${workspace.name}\n`;
      if (workspace.description) contextString += `Workspace Description: ${workspace.description}\n`;
    }

    // 2. Fetch Project Context
    if (projectId) {
      const project = await db.project.findUnique({
        where: { id: projectId },
        select: { name: true, description: true, key: true, workspaceId: true },
      });
      if (!project || project.workspaceId !== workspaceId) {
        throw new Error("Invalid project access");
      }
      contextString += `Project: ${project.name} (Key: ${project.key})\n`;
      if (project.description) contextString += `Project Description: ${project.description}\n`;
    }

    // 3. Fetch Board Context
    if (boardId) {
      const board = await db.board.findUnique({
        where: { id: boardId },
        include: {
          project: true,
          columns: {
            select: { id: true, name: true, position: true },
            orderBy: { position: 'asc' }
          }
        },
      });
      if (!board || board.project.workspaceId !== workspaceId) {
        throw new Error("Invalid board access");
      }
      if (board.visibility === 'PRIVATE' && board.createdById !== userId) {
        throw new Error("Unauthorized access to private board");
      }
      contextString += `Board: ${board.name} (Type: ${board.boardType})\n`;
      if (board.description) contextString += `Board Description: ${board.description}\n`;
      if (board.columns.length > 0) {
        contextString += `Board Columns: ${board.columns.map(c => c.name).join(', ')}\n`;
      }
    }

    // 4. Fetch WorkItem Context
    if (workItemId) {
      const workItem = await db.workItem.findUnique({
        where: { id: workItemId },
        include: {
          board: { include: { project: true } },
          assignee: { select: { firstName: true, lastName: true, email: true } }
        },
      });
      if (!workItem || workItem.board.project.workspaceId !== workspaceId) {
        throw new Error("Invalid work item access");
      }
      contextString += `WorkItem: ${workItem.title}\n`;
      contextString += `Status: ${workItem.status}, Type: ${workItem.type}, Priority: ${workItem.priority}\n`;
      if (workItem.description) contextString += `WorkItem Description: ${workItem.description}\n`;
      if (workItem.assignee) contextString += `Assignee: ${workItem.assignee.firstName} ${workItem.assignee.lastName}\n`;
    }

    return contextString;
  }
}
