import { FastifyRequest, FastifyReply } from 'fastify';
import { SavedFiltersService } from './saved-filters/saved-filters.service.js';
import { SavedViewsService } from './saved-filters/saved-views.service.js';
import { FilterQuerySchema, CreateSavedFilterDtoSchema, UpdateSavedFilterDtoSchema } from '@vertexpm/validation';

export class FilterController {
  // Query Validation & Building
  static async query(req: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = FilterQuerySchema.parse(req.body);
      const prismaQuery = await SavedFiltersService.buildPrismaQuery(parsed);
      reply.send(prismaQuery);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  static async validate(req: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = FilterQuerySchema.parse(req.body);
      const result = await SavedFiltersService.validateQuery(parsed);
      if (result.valid) {
        reply.send({ valid: true });
      } else {
        reply.status(400).send({ valid: false, error: result.error });
      }
    } catch (error: any) {
      reply.status(400).send({ valid: false, error: error.message });
    }
  }

  // Saved Filters
  static async createSavedFilter(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const workspaceId = req.headers['x-workspace-id'] as string || 'mock-workspace-id';
      
      const parsed = CreateSavedFilterDtoSchema.parse(req.body);
      const filter = await SavedFiltersService.createSavedFilter(userId, workspaceId, parsed);
      reply.status(201).send(filter);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  static async getSavedFilters(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const workspaceId = req.headers['x-workspace-id'] as string || 'mock-workspace-id';
      
      const filters = await SavedFiltersService.getSavedFilters(userId, workspaceId);
      reply.send(filters);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  static async updateSavedFilter(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const { id } = req.params;
      
      const parsed = UpdateSavedFilterDtoSchema.parse(req.body);
      const filter = await SavedFiltersService.updateSavedFilter(id, userId, parsed);
      reply.send(filter);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  static async deleteSavedFilter(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const { id } = req.params;
      
      await SavedFiltersService.deleteSavedFilter(id, userId);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  // Saved Views
  static async createSavedView(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const workspaceId = req.headers['x-workspace-id'] as string || 'mock-workspace-id';
      
      const view = await SavedViewsService.createSavedView(userId, workspaceId, req.body);
      reply.status(201).send(view);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  static async getSavedViews(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const workspaceId = req.headers['x-workspace-id'] as string || 'mock-workspace-id';
      
      const views = await SavedViewsService.getSavedViews(userId, workspaceId);
      reply.send(views);
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }

  static async updateSavedView(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const { id } = req.params;
      
      const view = await SavedViewsService.updateSavedView(id, userId, req.body);
      reply.send(view);
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  }

  static async deleteSavedView(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const userId = (req as any).user?.id || 'mock-user-id';
      const { id } = req.params;
      
      await SavedViewsService.deleteSavedView(id, userId);
      reply.status(204).send();
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  }
}
