import { db } from "../../db";

export class ProjectsRepository {
  async createProject(data: any) {
    return db.project.create({
      data,
    });
  }

  async findProjects(workspaceId: string, filters: any = {}, page: number = 1, limit: number = 20, search?: string, sortBy: string = 'createdAt', sortOrder: string = 'desc') {
    const skip = (page - 1) * limit;
    
    const where: any = { workspaceId, ...filters };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    return db.$transaction([
      db.project.count({ where }),
      db.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
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
