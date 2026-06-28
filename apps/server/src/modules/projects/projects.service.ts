import { ProjectsRepository } from "./projects.repository";
import { CreateProjectInput, UpdateProjectInput, GetProjectsQueryInput } from "@vertexpm/validation";
import { WorkspacesRepository } from "../workspaces/workspaces.repository";

const repository = new ProjectsRepository();
const workspacesRepository = new WorkspacesRepository();

function generateProjectKey(name: string) {
  const chars = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  let key = (chars.substring(0, 5) + randomStr).substring(0, 10);
  if (key.length < 3) {
    key = (key + "PRJ").substring(0, 3);
  }
  return key;
}

export class ProjectsService {
  private async checkWorkspaceAccess(workspaceId: string, userId: string) {
    const member = await workspacesRepository.findWorkspaceMember(workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized");
    }
    return member;
  }

  async createProject(data: CreateProjectInput, userId: string) {
    await this.checkWorkspaceAccess(data.workspaceId, userId);
    
    let key = data.key;
    if (!key) {
      key = generateProjectKey(data.name);
    }

    const project = await repository.createProject({
      ...data,
      key,
      ownerId: userId,
    });
    return project;
  }

  async getProjects(query: GetProjectsQueryInput, userId: string) {
    await this.checkWorkspaceAccess(query.workspaceId, userId);
    
    const filters: any = { deletedAt: null };
    if (query.status) filters.status = query.status;
    if (query.isArchived !== undefined) filters.isArchived = query.isArchived;

    const [total, projects] = await repository.findProjects(query.workspaceId, filters, query.page, query.limit);
    return {
      data: projects,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / (query.limit || 10)),
      }
    };
  }

  async getProjectById(id: string, userId: string) {
    const project = await repository.findProjectById(id);
    if (!project || project.deletedAt) throw new Error("Not found");
    
    await this.checkWorkspaceAccess(project.workspaceId, userId);
    return project;
  }

  async updateProject(id: string, data: UpdateProjectInput, userId: string) {
    const project = await repository.findProjectById(id);
    if (!project || project.deletedAt) throw new Error("Not found");
    
    await this.checkWorkspaceAccess(project.workspaceId, userId);
    
    return repository.updateProject(id, data);
  }

  async deleteProject(id: string, userId: string) {
    const project = await repository.findProjectById(id);
    if (!project || project.deletedAt) throw new Error("Not found");
    
    await this.checkWorkspaceAccess(project.workspaceId, userId);
    
    return repository.deleteProject(id);
  }
}
