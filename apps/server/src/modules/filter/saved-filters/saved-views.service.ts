import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SavedViewsService {
  static async createSavedView(userId: string, workspaceId: string, data: any) {
    return prisma.savedView.create({
      data: {
        userId,
        workspaceId,
        name: data.name,
        filterState: data.filterState ? JSON.stringify(data.filterState) : undefined,
        sortState: data.sortState ? JSON.stringify(data.sortState) : undefined,
        columns: data.columns ? JSON.stringify(data.columns) : undefined,
        isFavorite: data.isFavorite,
        isDefault: data.isDefault,
      }
    });
  }

  static async getSavedViews(userId: string, workspaceId: string) {
    return prisma.savedView.findMany({
      where: { userId, workspaceId }
    });
  }

  static async updateSavedView(id: string, userId: string, data: any) {
    return prisma.savedView.update({
      where: { id, userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.filterState !== undefined && { filterState: data.filterState ? JSON.stringify(data.filterState) : null }),
        ...(data.sortState !== undefined && { sortState: data.sortState ? JSON.stringify(data.sortState) : null }),
        ...(data.columns !== undefined && { columns: data.columns ? JSON.stringify(data.columns) : null }),
        ...(data.isFavorite !== undefined && { isFavorite: data.isFavorite }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
      }
    });
  }

  static async deleteSavedView(id: string, userId: string) {
    return prisma.savedView.delete({
      where: { id, userId }
    });
  }
}
