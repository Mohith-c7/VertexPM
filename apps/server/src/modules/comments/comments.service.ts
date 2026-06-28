import { CommentsRepository } from "./comments.repository";
import { CreateCommentInput, UpdateCommentInput, GetCommentsQueryInput } from "@vertexpm/validation";
import { activityService } from "../activity/activity.service";
import { realtimeDispatcher } from "../realtime-sync";

const repository = new CommentsRepository();

export class CommentsService {
  async createComment(workItemId: string, data: CreateCommentInput, userId: string) {
    const comment = await repository.createComment({
      ...data,
      workItemId,
      authorId: userId,
    });
    
    await activityService.recordActivity({
      actorId: userId,
      eventType: 'COMMENT_CREATED',
      entityType: 'Comment',
      entityId: comment.id,
      workItemId: workItemId,
      metadata: JSON.stringify({ content: comment.content.substring(0, 100) })
    });
    
    realtimeDispatcher.dispatch({
      event: "comment.created",
      entityId: comment.id,
      actor: { id: userId },
      payload: comment
    });
    
    return comment;
  }

  async getComments(workItemId: string, query: GetCommentsQueryInput) {
    const limit = query.limit || 50;
    const [total, comments] = await repository.getComments(workItemId, query.page, limit);
    
    return {
      data: comments,
      meta: {
        total,
        page: query.page || 1,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateComment(id: string, data: UpdateCommentInput, userId: string) {
    const comment = await repository.findCommentById(id);
    if (!comment || comment.deletedAt) throw new Error("Not found");
    if (comment.authorId !== userId) throw new Error("Unauthorized to edit this comment");
    
    const updated = await repository.updateComment(id, {
      ...data,
      isEdited: true,
      editedAt: new Date()
    });
    
    await activityService.recordActivity({
      actorId: userId,
      eventType: 'COMMENT_UPDATED',
      entityType: 'Comment',
      entityId: id,
      workItemId: comment.workItemId,
    });
    
    realtimeDispatcher.dispatch({
      event: "comment.updated",
      entityId: updated.id,
      actor: { id: userId },
      payload: updated
    });
    
    return updated;
  }

  async deleteComment(id: string, userId: string) {
    const comment = await repository.findCommentById(id);
    if (!comment || comment.deletedAt) throw new Error("Not found");
    if (comment.authorId !== userId) throw new Error("Unauthorized to delete this comment");
    
    await repository.deleteComment(id);
    
    await activityService.recordActivity({
      actorId: userId,
      eventType: 'COMMENT_DELETED',
      entityType: 'Comment',
      entityId: id,
      workItemId: comment.workItemId,
    });
    
    realtimeDispatcher.dispatch({
      event: "comment.deleted",
      entityId: id,
      actor: { id: userId },
      payload: { id }
    });
    
    return true;
  }
}
