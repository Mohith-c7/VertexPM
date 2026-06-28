import { PrismaClient } from "@prisma/client";

export class SearchHistoryService {
  constructor(private prisma: PrismaClient) {}

  async getHistory(userId: string, workspaceId: string) {
    return this.prisma.searchHistory.findMany({
      where: { userId, workspaceId },
      orderBy: { createdAt: "desc" },
      take: 10
    });
  }

  async addHistory(userId: string, workspaceId: string, query: string, filters?: any) {
    // Basic deduplication for recent identical searches could be added here
    return this.prisma.searchHistory.create({
      data: {
        userId,
        workspaceId,
        query,
        filters: filters ? JSON.stringify(filters) : null,
      }
    });
  }

  async clearHistory(userId: string, workspaceId: string) {
    return this.prisma.searchHistory.deleteMany({
      where: { userId, workspaceId }
    });
  }
}
