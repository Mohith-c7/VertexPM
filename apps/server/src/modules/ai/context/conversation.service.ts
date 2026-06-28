import { db } from "../../../db";
import { AiMessageRole } from "@prisma/client";

export class ConversationService {
  /**
   * Create a new AI Conversation
   */
  static async createConversation(userId: string, workspaceId: string, title?: string) {
    return db.aiConversation.create({
      data: {
        userId,
        workspaceId,
        title: title || "New Conversation",
      },
    });
  }

  /**
   * Get all conversations for a user in a workspace
   */
  static async getConversations(userId: string, workspaceId: string) {
    return db.aiConversation.findMany({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Get a single conversation and verify ownership
   */
  static async getConversation(conversationId: string, userId: string) {
    const conversation = await db.aiConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new Error("Conversation not found or unauthorized");
    }

    return conversation;
  }

  /**
   * Add a message to a conversation
   */
  static async addMessage(
    conversationId: string,
    role: AiMessageRole,
    content: string,
    provider?: string,
    model?: string,
    inputTokens?: number,
    outputTokens?: number
  ) {
    return db.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
        provider,
        model,
        inputTokens,
        outputTokens,
      },
    });
  }

  /**
   * Get messages for a conversation with sliding-window truncation
   * Only returns the most recent `limit` messages to fit within context limits.
   */
  static async getMessages(conversationId: string, limit: number = 20) {
    const messages = await db.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Reverse to maintain chronological order
    return messages.reverse();
  }
}
