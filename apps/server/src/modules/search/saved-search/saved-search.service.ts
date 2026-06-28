import { PrismaClient } from "@prisma/client";
import type { CreateSavedSearch, UpdateSavedSearch } from "@vertexpm/validation";

export class SavedSearchService {
  constructor(private prisma: PrismaClient) {}

  async getSavedSearches(userId: string, workspaceId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId, workspaceId },
      orderBy: { createdAt: "desc" }
    });
  }

  async createSavedSearch(userId: string, workspaceId: string, data: CreateSavedSearch) {
    return this.prisma.savedSearch.create({
      data: {
        userId,
        workspaceId,
        name: data.name,
        query: data.query,
        entityTypes: data.type ? JSON.stringify(data.type) : null,
      }
    });
  }

  async updateSavedSearch(userId: string, id: string, data: UpdateSavedSearch) {
    // Only allow updating own searches
    const existing = await this.prisma.savedSearch.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Saved search not found or unauthorized");
    }

    return this.prisma.savedSearch.update({
      where: { id },
      data: {
        name: data.name,
        query: data.query,
        entityTypes: data.type ? JSON.stringify(data.type) : undefined,
      }
    });
  }

  async deleteSavedSearch(userId: string, id: string) {
    const existing = await this.prisma.savedSearch.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Saved search not found or unauthorized");
    }

    return this.prisma.savedSearch.delete({
      where: { id }
    });
  }
}
