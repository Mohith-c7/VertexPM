import { FastifyReply, FastifyRequest } from "fastify";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceInput, UpdateWorkspaceInput, AddWorkspaceMemberInput } from "@vertexpm/validation";

const service = new WorkspacesService();

export async function createWorkspaceHandler(req: FastifyRequest<{ Body: CreateWorkspaceInput }>, reply: FastifyReply) {
  try {
    const workspace = await service.createWorkspace(req.body, (req as any).user.id);
    return reply.status(201).send(workspace);
  } catch (error) {
    return reply.status(400).send({ error: (error as Error).message });
  }
}

export async function getWorkspacesHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const workspaces = await service.getWorkspaces((req as any).user.id);
    return reply.status(200).send(workspaces);
  } catch (error) {
    return reply.status(400).send({ error: (error as Error).message });
  }
}

export async function getWorkspaceByIdHandler(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const workspace = await service.getWorkspaceById(req.params.id, (req as any).user.id);
    return reply.status(200).send(workspace);
  } catch (error) {
    if ((error as Error).message === "Unauthorized") return reply.status(403).send({ error: "Unauthorized" });
    return reply.status(404).send({ error: (error as Error).message });
  }
}

export async function updateWorkspaceHandler(req: FastifyRequest<{ Params: { id: string }, Body: UpdateWorkspaceInput }>, reply: FastifyReply) {
  try {
    const workspace = await service.updateWorkspace(req.params.id, req.body, (req as any).user.id);
    return reply.status(200).send(workspace);
  } catch (error) {
    return reply.status(403).send({ error: (error as Error).message });
  }
}

export async function deleteWorkspaceHandler(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    await service.deleteWorkspace(req.params.id, (req as any).user.id);
    return reply.status(204).send();
  } catch (error) {
    return reply.status(403).send({ error: (error as Error).message });
  }
}

export async function getMembersHandler(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const members = await service.getMembers(req.params.id, (req as any).user.id);
    return reply.status(200).send(members);
  } catch (error) {
    return reply.status(403).send({ error: (error as Error).message });
  }
}

export async function addMemberHandler(req: FastifyRequest<{ Params: { id: string }, Body: AddWorkspaceMemberInput }>, reply: FastifyReply) {
  try {
    const member = await service.addMember(req.params.id, req.body, (req as any).user.id);
    return reply.status(201).send(member);
  } catch (error) {
    return reply.status(400).send({ error: (error as Error).message });
  }
}

export async function removeMemberHandler(req: FastifyRequest<{ Params: { id: string, memberId: string } }>, reply: FastifyReply) {
  try {
    await service.removeMember(req.params.id, req.params.memberId, (req as any).user.id);
    return reply.status(204).send();
  } catch (error) {
    return reply.status(403).send({ error: (error as Error).message });
  }
}
