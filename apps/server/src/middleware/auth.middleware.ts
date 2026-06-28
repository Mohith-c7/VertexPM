import { verifyAccessToken } from "../utils/jwt";
import { errorResponse } from "../utils/response";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return reply.status(401).send(errorResponse("Unauthorized", "UNAUTHORIZED"));
  }

  const token = authHeader.substring(7);
  try {
    const decoded = verifyAccessToken(token);
    (request as any).user = { id: decoded.userId };
  } catch (err) {
    return reply.status(401).send(errorResponse("Invalid or expired token", "UNAUTHORIZED"));
  }
}
