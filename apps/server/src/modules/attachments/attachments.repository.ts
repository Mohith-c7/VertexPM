import { db } from "../../db";

export class AttachmentsRepository {
  async createAttachment(data: any) {
    return db.attachment.create({
      data,
      include: {
        uploadedBy: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        }
      }
    });
  }

  async getAttachments(workItemId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    
    return db.$transaction([
      db.attachment.count({ where: { workItemId, deletedAt: null } }),
      db.attachment.findMany({
        where: { workItemId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true }
          }
        }
      })
    ]);
  }

  async findAttachmentById(id: string) {
    return db.attachment.findUnique({
      where: { id },
    });
  }

  async deleteAttachment(id: string) {
    return db.attachment.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
