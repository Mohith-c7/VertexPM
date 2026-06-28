import { WorkspacesRepository } from "./workspaces.repository";
import { CreateWorkspaceInput, UpdateWorkspaceInput, AddWorkspaceMemberInput } from "@vertexpm/validation";

const repository = new WorkspacesRepository();

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).substring(2, 6);
}

export class WorkspacesService {
  async createWorkspace(data: CreateWorkspaceInput, userId: string) {
    const slug = data.slug || generateSlug(data.name);
    const workspace = await repository.createWorkspace({
      ...data,
      slug,
      ownerId: userId,
    });
    console.log(`Workspace Created: ${workspace.id}`);
    return workspace;
  }

  async getWorkspaces(userId: string) {
    return repository.findWorkspacesByUserId(userId);
  }

  async getWorkspaceById(id: string, userId: string) {
    const member = await repository.findWorkspaceMember(id, userId);
    if (!member) {
      throw new Error("Unauthorized");
    }
    const workspace = await repository.findWorkspaceById(id);
    if (!workspace) throw new Error("Not found");
    return workspace;
  }

  async updateWorkspace(id: string, data: UpdateWorkspaceInput, userId: string) {
    const member = await repository.findWorkspaceMember(id, userId);
    if (!member || member.role !== "OWNER") {
      throw new Error("Unauthorized");
    }
    const workspace = await repository.updateWorkspace(id, data);
    console.log(`Workspace Updated: ${workspace.id}`);
    return workspace;
  }

  async deleteWorkspace(id: string, userId: string) {
    const workspace = await repository.findWorkspaceById(id);
    if (!workspace) throw new Error("Not found");
    if (workspace.ownerId !== userId) {
      throw new Error("Unauthorized");
    }
    await repository.deleteWorkspace(id);
    console.log(`Workspace Deleted: ${id}`);
    return true;
  }

  async getMembers(workspaceId: string, userId: string) {
    const member = await repository.findWorkspaceMember(workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized");
    }
    return repository.getMembers(workspaceId);
  }

  async addMember(workspaceId: string, data: AddWorkspaceMemberInput, currentUserId: string) {
    const currentMember = await repository.findWorkspaceMember(workspaceId, currentUserId);
    if (!currentMember || currentMember.role !== "OWNER") {
      throw new Error("Unauthorized");
    }
    return repository.addMember(workspaceId, data.userId, data.role as "OWNER" | "MEMBER");
  }

  async removeMember(workspaceId: string, memberId: string, currentUserId: string) {
    const currentMember = await repository.findWorkspaceMember(workspaceId, currentUserId);
    if (!currentMember || currentMember.role !== "OWNER") {
      throw new Error("Unauthorized");
    }
    if (memberId === currentUserId) {
      throw new Error("Cannot remove yourself");
    }
    return repository.removeMember(workspaceId, memberId);
  }
}
