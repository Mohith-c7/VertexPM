import { db } from "../../db";

export class ProjectsRepository {
  async createProject(data: any) {
    return db.project.create({
      data,
    });
  }

  async findProjects(workspaceId: string, filters: any = {}, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    return db.$transaction([
      db.project.count({ where: { workspaceId, ...filters } }),
      db.project.findMany({
        where: { workspaceId, ...filters },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);
  }

  async findProjectById(id: string) {
    return db.project.findUnique({
      where: { id },
    });
  }

  async updateProject(id: string, data: any) {
    return db.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: string) {
    return db.project.update({
      where: { id },
      data: {
        isArchived: true,
        deletedAt: new Date(),
      },
    });
  }
}
