import { ActivityRepository } from "./activity.repository";
import { GetActivityQueryInput } from "@vertexpm/validation";

const repository = new ActivityRepository();

export class ActivityService {
  async recordActivity(data: {
    actorId: string;
    eventType: any;
    entityType: string;
    entityId: string;
    workspaceId?: string;
    projectId?: string;
    boardId?: string;
    workItemId?: string;
    oldValue?: string;
    newValue?: string;
    metadata?: string;
  }) {
    return repository.createLog(data);
  }

  async getWorkItemActivity(workItemId: string, query: GetActivityQueryInput) {
    const filters = { workItemId };
    const limit = query.limit || 50;
    
    const [total, logs] = await repository.findLogs(filters, query.page, limit);
    return {
      data: logs,
      meta: { total, page: query.page || 1, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async getBoardActivity(boardId: string, query: GetActivityQueryInput) {
    const filters = { boardId };
    const limit = query.limit || 50;
    
    const [total, logs] = await repository.findLogs(filters, query.page, limit);
    return {
      data: logs,
      meta: { total, page: query.page || 1, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async getProjectActivity(projectId: string, query: GetActivityQueryInput) {
    const filters = { projectId };
    const limit = query.limit || 50;
    
    const [total, logs] = await repository.findLogs(filters, query.page, limit);
    return {
      data: logs,
      meta: { total, page: query.page || 1, limit, totalPages: Math.ceil(total / limit) }
    };
  }
}

// Export a singleton instance to be used across modules
export const activityService = new ActivityService();
