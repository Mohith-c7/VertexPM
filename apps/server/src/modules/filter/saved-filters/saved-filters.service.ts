import { PrismaClient } from '@prisma/client';
import { FilterQuery, SavedFilter, CreateSavedFilterDto, UpdateSavedFilterDto } from '@vertexpm/validation';
import { FilterEngine } from '../engine/filter.engine.js';

const prisma = new PrismaClient();

export class SavedFiltersService {
  static async validateQuery(query: FilterQuery) {
    try {
      FilterEngine.buildQuery(query);
      return { valid: true };
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  }

  static async buildPrismaQuery(query: FilterQuery) {
    return FilterEngine.buildQuery(query);
  }

  static async createSavedFilter(userId: string, workspaceId: string, dto: CreateSavedFilterDto) {
    return prisma.savedFilter.create({
      data: {
        userId,
        workspaceId,
        name: dto.name,
        filterState: JSON.stringify(dto.query),
        isFavorite: dto.isPublic, // using isPublic from DTO to map to isFavorite for now or handle appropriately
      }
    });
  }

  static async getSavedFilters(userId: string, workspaceId: string) {
    return prisma.savedFilter.findMany({
      where: { userId, workspaceId }
    });
  }

  static async updateSavedFilter(id: string, userId: string, dto: UpdateSavedFilterDto) {
    return prisma.savedFilter.update({
      where: { id, userId }, // Ensure user owns it
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.query && { filterState: JSON.stringify(dto.query) }),
        ...(dto.isPublic !== undefined && { isFavorite: dto.isPublic }),
      }
    });
  }

  static async deleteSavedFilter(id: string, userId: string) {
    return prisma.savedFilter.delete({
      where: { id, userId }
    });
  }
}
