import { AttachmentsRepository } from "./attachments.repository";
import { CreateAttachmentInput, GetAttachmentsQueryInput } from "@vertexpm/validation";
import { activityService } from "../activity/activity.service";
import fs from "fs";
import path from "path";

const repository = new AttachmentsRepository();

export class AttachmentsService {
  async uploadAttachment(workItemId: string, data: CreateAttachmentInput, userId: string) {
    // Mock local storage abstraction
    const storageDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    
    const storageKey = `${Date.now()}-${data.fileName}`;
    const filePath = path.join(storageDir, storageKey);
    
    // Save base64 mock data to file
    const base64Data = data.data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const attachment = await repository.createAttachment({
      workItemId,
      uploadedById: userId,
      fileName: data.fileName,
      originalName: data.originalName,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      storageKey,
      storageProvider: 'LOCAL'
    });
    
    await activityService.recordActivity({
      actorId: userId,
      eventType: 'ATTACHMENT_ADDED',
      entityType: 'Attachment',
      entityId: attachment.id,
      workItemId: workItemId,
      metadata: JSON.stringify({ fileName: attachment.fileName })
    });
    
    return attachment;
  }

  async getAttachments(workItemId: string, query: GetAttachmentsQueryInput) {
    const limit = query.limit || 50;
    const [total, attachments] = await repository.getAttachments(workItemId, query.page, limit);
    
    return {
      data: attachments,
      meta: {
        total,
        page: query.page || 1,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async deleteAttachment(id: string, userId: string) {
    const attachment = await repository.findAttachmentById(id);
    if (!attachment || attachment.deletedAt) throw new Error("Not found");
    if (attachment.uploadedById !== userId) throw new Error("Unauthorized to delete this attachment");
    
    await repository.deleteAttachment(id);
    
    await activityService.recordActivity({
      actorId: userId,
      eventType: 'ATTACHMENT_REMOVED',
      entityType: 'Attachment',
      entityId: id,
      workItemId: attachment.workItemId,
      metadata: JSON.stringify({ fileName: attachment.fileName })
    });
    
    return true;
  }
}
