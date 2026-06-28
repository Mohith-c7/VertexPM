import type { FastifyRequest, FastifyReply } from "fastify";
import { signup, login, logout, refreshTokens } from "./auth.service";
import { successResponse, errorResponse } from "../../utils/response";
import { signupSchema, loginSchema, refreshTokenSchema } from "@vertexpm/validation";
import { findUserById, sanitizeUser } from "../users/users.service";

export async function handleSignup(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = signupSchema.parse(request.body);
    const data = await signup(body);
    return reply.status(201).send(successResponse("Signup successful", data));
  } catch (err: any) {
    return reply.status(400).send(errorResponse(err.message, "BAD_REQUEST", err));
  }
}

export async function handleLogin(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = loginSchema.parse(request.body);
    const data = await login(body);
    return reply.status(200).send(successResponse("Login successful", data));
  } catch (err: any) {
    return reply.status(401).send(errorResponse(err.message, "UNAUTHORIZED", err));
  }
}

export async function handleLogout(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (request as any).user?.id;
    if (userId) {
      await logout(userId);
    }
    return reply.status(200).send(successResponse("Logout successful"));
  } catch (err: any) {
    return reply.status(500).send(errorResponse(err.message, "INTERNAL_ERROR", err));
  }
}

export async function handleRefresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = refreshTokenSchema.parse(request.body);
    const data = await refreshTokens(body.refreshToken);
    return reply.status(200).send(successResponse("Token refreshed", data));
  } catch (err: any) {
    return reply.status(401).send(errorResponse(err.message, "UNAUTHORIZED", err));
  }
}

export async function handleMe(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (request as any).user.id;
    const user = await findUserById(userId);
    if (!user) {
      return reply.status(404).send(errorResponse("User not found", "NOT_FOUND"));
    }
    return reply.status(200).send(successResponse("User fetched", sanitizeUser(user)));
  } catch (err: any) {
    return reply.status(500).send(errorResponse(err.message, "INTERNAL_ERROR", err));
  }
}
