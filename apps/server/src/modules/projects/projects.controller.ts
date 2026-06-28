import { FastifyReply, FastifyRequest } from "fastify";
import { ProjectsService } from "./projects.service";
import { 
  createProjectSchema, 
  updateProjectSchema, 
  projectParamsSchema,
  getProjectsQuerySchema
} from "@vertexpm/validation";
import { successResponse, errorResponse } from "../../utils/response";

const service = new ProjectsService();

export async function createProjectHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = createProjectSchema.parse(req.body);
    const project = await service.createProject(body, (req as any).user.id);
    return reply.status(201).send(successResponse("Project created successfully", project));
  } catch (error: any) {
    if (error.message === "Unauthorized") return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    if (error.code === 'P2002') {
      return reply.status(400).send(errorResponse("Project with this key already exists in the workspace", "BAD_REQUEST", error));
    }
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getProjectsHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = getProjectsQuerySchema.parse(req.query);
    const workspaceIdParam = (req.params as any).workspaceId;
    const result = await service.getProjects(query, (req as any).user.id, workspaceIdParam);
    return reply.status(200).send(successResponse("Projects fetched successfully", result));
  } catch (error: any) {
    if (error.message === "Unauthorized") return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function getProjectByIdHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = projectParamsSchema.parse(req.params);
    const project = await service.getProjectById(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Project fetched successfully", project));
  } catch (error: any) {
    if (error.message === "Unauthorized") return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    return reply.status(404).send(errorResponse(error.message, "NOT_FOUND", error));
  }
}

export async function updateProjectHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = projectParamsSchema.parse(req.params);
    const body = updateProjectSchema.parse(req.body);
    const project = await service.updateProject(params.id, body, (req as any).user.id);
    return reply.status(200).send(successResponse("Project updated successfully", project));
  } catch (error: any) {
    if (error.message === "Unauthorized") return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    if (error.message === "Not found") return reply.status(404).send(errorResponse("Not found", "NOT_FOUND"));
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}

export async function deleteProjectHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const params = projectParamsSchema.parse(req.params);
    await service.deleteProject(params.id, (req as any).user.id);
    return reply.status(200).send(successResponse("Project deleted successfully"));
  } catch (error: any) {
    if (error.message === "Unauthorized") return reply.status(403).send(errorResponse("Unauthorized", "FORBIDDEN"));
    if (error.message === "Not found") return reply.status(404).send(errorResponse("Not found", "NOT_FOUND"));
    return reply.status(400).send(errorResponse(error.message, "BAD_REQUEST", error));
  }
}
