import { db } from "../../db";

export class WorkspacesRepository {
  async createWorkspace(data: { name: string; slug: string; description?: string; icon?: string; ownerId: string }) {
    return db.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        ownerId: data.ownerId,
        members: {
          create: {
            userId: data.ownerId,
            role: "OWNER",
          },
        },
      },
    });
  }

  async findWorkspacesByUserId(userId: string) {
    return db.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
    });
  }

  async findWorkspaceById(id: string) {
    return db.workspace.findUnique({
      where: { id },
    });
  }

  async updateWorkspace(id: string, data: { name?: string; description?: string; icon?: string }) {
    return db.workspace.update({
      where: { id },
      data,
    });
  }

  async deleteWorkspace(id: string) {
    return db.workspace.delete({
      where: { id },
    });
  }

  async findWorkspaceMember(workspaceId: string, userId: string) {
    return db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  async addMember(workspaceId: string, userId: string, role: "OWNER" | "MEMBER") {
    return db.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role,
      },
    });
  }

  async removeMember(workspaceId: string, userId: string) {
    return db.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  async getMembers(workspaceId: string) {
    return db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });
  }
}
