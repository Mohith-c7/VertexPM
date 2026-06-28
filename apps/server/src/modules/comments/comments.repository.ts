import { db } from "../../db";

export class CommentsRepository {
  async createComment(data: any) {
    return db.comment.create({
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        }
      }
    });
  }

  async getComments(workItemId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    
    return db.$transaction([
      db.comment.count({ where: { workItemId, deletedAt: null } }),
      db.comment.findMany({
        where: { workItemId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true }
          },
          mentions: {
            include: {
              mentionedUser: {
                select: { id: true, firstName: true, lastName: true }
              }
            }
          }
        }
      })
    ]);
  }

  async findCommentById(id: string) {
    return db.comment.findUnique({
      where: { id },
      include: { workItem: true }
    });
  }

  async updateComment(id: string, data: any) {
    return db.comment.update({
      where: { id },
      data,
    });
  }

  async deleteComment(id: string) {
    return db.comment.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
