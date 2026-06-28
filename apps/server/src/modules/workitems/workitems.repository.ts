import { db } from "../../db";
import { Prisma, WorkItem, WorkItemDependency } from "@prisma/client";

export class WorkItemRepository {
  async create(data: Prisma.WorkItemUncheckedCreateInput): Promise<WorkItem> {
    return db.workItem.create({
      data,
    });
  }

  async findById(id: string): Promise<WorkItem | null> {
    return db.workItem.findUnique({
      where: { id },
      include: {
        assignee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        reporter: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });
  }

  async findMany(args: Prisma.WorkItemFindManyArgs): Promise<WorkItem[]> {
    return db.workItem.findMany(args);
  }

  async count(where: Prisma.WorkItemWhereInput): Promise<number> {
    return db.workItem.count({ where });
  }

  async update(id: string, data: Prisma.WorkItemUpdateInput): Promise<WorkItem> {
    return db.workItem.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<WorkItem> {
    return db.workItem.update({
      where: { id },
      data: { isArchived: true, deletedAt: new Date() },
    });
  }

  async getMaxPosition(boardId: string, columnId: string): Promise<number> {
    const lastItem = await db.workItem.findFirst({
      where: { boardId, columnId, deletedAt: null, isArchived: false },
      orderBy: { position: "desc" },
    });
    return lastItem ? lastItem.position : 0;
  }
  
  async createDependency(predecessorId: string, successorId: string): Promise<WorkItemDependency> {
    return db.workItemDependency.create({
      data: {
        predecessorId,
        successorId,
      },
    });
  }

  async findDependencies(workItemId: string) {
    return {
      predecessors: await db.workItemDependency.findMany({
        where: { successorId: workItemId },
        include: { predecessor: true },
      }),
      successors: await db.workItemDependency.findMany({
        where: { predecessorId: workItemId },
        include: { successor: true },
      }),
    };
  }

  async deleteDependency(dependencyId: string): Promise<WorkItemDependency> {
    return db.workItemDependency.delete({
      where: { id: dependencyId },
    });
  }
}

export const workItemRepository = new WorkItemRepository();
