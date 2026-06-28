import { workItemRepository } from "./workitems.repository";
import { CreateWorkItemInput, UpdateWorkItemInput, QueryWorkItemsInput } from "@vertexpm/validation";
import { Prisma } from "@prisma/client";

export class WorkItemService {
  async createWorkItem(boardId: string, reporterId: string, input: CreateWorkItemInput, parentId?: string) {
    const position = input.position ?? (await workItemRepository.getMaxPosition(boardId, input.columnId)) + 1024;
    
    return workItemRepository.create({
      ...input,
      boardId,
      reporterId,
      position,
      parentId,
    });
  }

  async getWorkItems(boardId: string, query: QueryWorkItemsInput) {
    const { page, limit, sortBy, sortOrder, search, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.WorkItemWhereInput = {
      boardId,
      deletedAt: null,
      isArchived: false,
      ...filters,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      workItemRepository.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          reporter: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      }),
      workItemRepository.count(where),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWorkItemById(id: string) {
    const item = await workItemRepository.findById(id);
    if (!item) throw new Error("WorkItem not found");
    return item;
  }

  async updateWorkItem(id: string, input: UpdateWorkItemInput) {
    // If columnId is changed, we should ideally handle position logic here.
    // For simplicity, we just pass the input.
    return workItemRepository.update(id, input);
  }

  async deleteWorkItem(id: string) {
    return workItemRepository.softDelete(id);
  }
  
  async getSubtasks(id: string) {
    return workItemRepository.findMany({
      where: { parentId: id, deletedAt: null, isArchived: false },
      orderBy: { position: "asc" },
    });
  }
  
  async createDependency(predecessorId: string, successorId: string) {
    if (predecessorId === successorId) throw new Error("WorkItem cannot depend on itself");
    return workItemRepository.createDependency(predecessorId, successorId);
  }

  async getDependencies(id: string) {
    return workItemRepository.findDependencies(id);
  }

  async deleteDependency(dependencyId: string) {
    return workItemRepository.deleteDependency(dependencyId);
  }
}

export const workItemService = new WorkItemService();
