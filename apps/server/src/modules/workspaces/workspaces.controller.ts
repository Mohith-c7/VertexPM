import { FastifyReply, FastifyRequest } from "fastify";
import { WorkspacesService } from "./workspaces.service";
import { 
  createWorkspaceSchema, 
  updateWorkspaceSchema, 
  addWorkspaceMemberSchema,
  workspaceIdParamSchema,
  workspaceMemberParamsSchema
} from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

const service = new WorkspacesService();

export async function createWorkspaceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = createWorkspaceSchema.parse(req.body);
    const workspace = await service.createWorkspace(body, (req as any).user.id);
    return reply.status(201).send(successResponse("Workspace created successfully", workspace));
  } catch (error: any) {
    if (error.code === 'P2002') {
      return reply.status(400).send(errorResponse("Workspace with this slug already exists", "BAD_REQUEST", error));
    }
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getWorkspacesHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const workspaces = await service.getWorkspaces((req as any).user.id);
    return reply.status(200).send(successResponse("Workspaces fetched successfully", workspaces));
  } catch (error: any) {
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getWorkspaceByIdHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = workspaceIdParamSchema.parse(req.params);
    const workspace = await service.getWorkspaceById(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Workspace fetched successfully", workspace));
  } catch (error: any) {
    if (error.message === "Unauthorized") return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    return reply.status(404).send(errorResponse(error.message, "NOT_FOUND", error));
  }
}

export async function updateWorkspaceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = workspaceIdParamSchema.parse(req.params);
    const body = updateWorkspaceSchema.parse(req.body);
    const workspace = await service.updateWorkspace(params.id, body, (req as any).user.id);
    return reply.status(200).send(successResponse("Workspace updated successfully", workspace));
  } catch (error: any) {
    return reply.status(403).send(errorResponse(error.message, "FORBIDDEN", error));
  }
}

export async function deleteWorkspaceHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = workspaceIdParamSchema.parse(req.params);
    await service.deleteWorkspace(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Workspace deleted successfully"));
  } catch (error: any) {
    return reply.status(403).send(errorResponse(error.message, "FORBIDDEN", error));
  }
}

export async function getMembersHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = workspaceIdParamSchema.parse(req.params);
    const members = await service.getMembers(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Workspace members fetched successfully", members));
  } catch (error: any) {
    return reply.status(403).send(errorResponse(error.message, "FORBIDDEN", error));
  }
}

export async function addMemberHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = workspaceIdParamSchema.parse(req.params);
    const body = addWorkspaceMemberSchema.parse(req.body);
    const member = await service.addMember(params.id, body, (req as any).user.id);
    return reply.status(201).send(successResponse("Workspace member added successfully", member));
  } catch (error: any) {
    if (error.code === 'P2002') {
      return reply.status(400).send(errorResponse("Duplicate member", "BAD_REQUEST", error));
    }
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function removeMemberHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = workspaceMemberParamsSchema.parse(req.params);
    await service.removeMember(params.id, params.memberId, (req as any).user.id);
    return reply.status(200).send(successResponse("Workspace member removed successfully"));
  } catch (error: any) {
    return reply.status(403).send(errorResponse(error.message, "FORBIDDEN", error));
  }
}
