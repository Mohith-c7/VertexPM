import { FastifyReply, FastifyRequest } from "fastify";
import { ConversationService } from "./conversation.service";
import { ContextBuilder } from "./context.builder";
import { 
  chatRequestSchema, 
  createConversationSchema 
} from "./context.dto";
import { z } from "zod";
import { AIGateway } from "../gateway";
import { promptEngine } from "../prompts";

// Register prompt for chat if not exists
try {
  promptEngine.get("chat_with_context");
} catch {
  promptEngine.register({
    id: "chat_with_context",
    version: "1.0",
    template: `System: You are an AI assistant for VertexPM.
Use the following context to help answer the user's query.
{{context}}

Conversation History:
{{history}}

User: {{prompt}}
Assistant:`,
    defaults: {
      context: "No specific context provided.",
      history: "No history.",
    }
  });
}

export class ContextController {
  
  static async chat(req: FastifyRequest, reply: FastifyReply) {
    try {
      const body = chatRequestSchema.parse(req.body);
      const userId = (req as any).user.id;

      // 1. Resolve or Create Conversation
      let conversationId = body.conversationId;
      if (!conversationId) {
        const conv = await ConversationService.createConversation(userId, body.workspaceId, body.message.substring(0, 50));
        conversationId = conv.id;
      } else {
        await ConversationService.getConversation(conversationId, userId);
      }

      // 2. Fetch context
      let contextStr = "";
      try {
        contextStr = await ContextBuilder.buildContext({
          workspaceId: body.workspaceId,
          projectId: body.projectId,
          boardId: body.boardId,
          workItemId: body.workItemId,
          userId,
        });
      } catch (err: any) {
        return reply.status(403).send({ error: err.message });
      }

      // 3. Sliding Window History
      const messages = await ConversationService.getMessages(conversationId, 20);
      const historyStr = messages.map(m => `${m.role}: ${m.content}`).join("\n");

      // 4. Save User Message
      await ConversationService.addMessage(
        conversationId,
        "USER",
        body.message
      );

      // 5. Dispatch to AIGateway
      const streamResponse = await AIGateway.generateStream("chat_with_context", {
        context: contextStr,
        history: historyStr,
        prompt: body.message,
      });

      // streamResponse is a Web API Response from vercel/ai
      // To send this in Fastify, we set headers and send the body stream
      reply.header('Content-Type', streamResponse.headers.get('Content-Type') || 'text/plain');
      if (streamResponse.headers.has('Transfer-Encoding')) {
        reply.header('Transfer-Encoding', streamResponse.headers.get('Transfer-Encoding'));
      }
      
      // Using .send() with a ReadableStream might work depending on fastify version, 
      // otherwise it sends the object. Let's just return it which fastify might support, 
      // or send streamResponse.body
      return reply.send(streamResponse.body);

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: "Validation Error", details: (error as any).errors });
      }
      return reply.status(500).send({ error: error.message });
    }
  }

  static async getConversations(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;
      const workspaceId = (req.query as any).workspaceId;
      if (!workspaceId) {
        return reply.status(400).send({ error: "workspaceId is required" });
      }
      
      const conversations = await ConversationService.getConversations(userId, workspaceId);
      return reply.status(200).send(conversations);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  }

  static async createConversation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;
      const body = createConversationSchema.parse(req.body);
      const conv = await ConversationService.createConversation(userId, body.workspaceId, body.title);
      return reply.status(201).send(conv);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: "Validation Error", details: (error as any).errors });
      }
      return reply.status(500).send({ error: error.message });
    }
  }

  static async getConversation(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params as any;
      const conv = await ConversationService.getConversation(id, userId);
      const messages = await ConversationService.getMessages(id, 50); // Get up to 50 for view
      return reply.status(200).send({ ...conv, messages });
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  }

  static async addMessage(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params as any;
      const { role, content, provider, model, inputTokens, outputTokens } = req.body as any;
      
      // Verify ownership
      await ConversationService.getConversation(id, userId);

      const msg = await ConversationService.addMessage(
        id,
        role,
        content,
        provider,
        model,
        inputTokens,
        outputTokens
      );
      
      return reply.status(201).send(msg);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  }
}
