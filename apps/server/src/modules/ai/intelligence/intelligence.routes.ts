import { FastifyInstance } from 'fastify';
import { intelligenceEngine } from './intelligence.engine';
import { intelligenceExecutor } from './intelligence.executor';
import { z } from 'zod';
import { db } from '../../../db';
import { requireAuth } from '../../../middleware/auth.middleware';

const AiIntelligenceResponseSchema = z.object({
  healthScore: z.number(),
  status: z.enum(['Healthy', 'At Risk', 'Critical']),
  summary: z.string(),
  recommendations: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['risk', 'optimization', 'info']),
      title: z.string(),
      description: z.string(),
    })
  ),
  sprintHealth: z.object({
    completionRate: z.number(),
    scopeCreep: z.number(),
  }),
  risks: z.array(
    z.object({
      title: z.string(),
      severity: z.enum(['high', 'medium', 'low']),
      description: z.string(),
    })
  ),
  workload: z.object({
    frontend: z.number(),
    backend: z.number(),
    design: z.number(),
  }),
  productivity: z.object({
    trend: z.enum(['up', 'down', 'stable']),
    value: z.number(),
  }),
  duplicates: z.number(),
  dependencies: z.number(),
});

export async function intelligenceRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAuth);

  fastify.post('/api/ai/intelligence/sprint-plan', async (request, reply) => {
    const result = await intelligenceEngine.sprintPlanner.plan(request.body);
    return reply.send(result);
  });
  
  fastify.post('/api/ai/intelligence/project-summary', async (request, reply) => {
    const result = await intelligenceEngine.projectSummary.analyze(request.body);
    return reply.send(result);
  });

  fastify.get('/api/ai/intelligence/:projectId', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        boards: {
          include: {
            workItems: {
              include: {
                comments: true,
                attachments: true,
              }
            }
          }
        }
      }
    });

    if (!project) {
      return reply.status(404).send({ success: false, message: 'Project not found' });
    }

    const user = (request as any).user;
    const member = await db.workspaceMember.findFirst({
      where: { workspaceId: project.workspaceId, userId: user.id },
    });
    if (!member) {
      return reply.status(403).send({ success: false, message: 'Forbidden' });
    }

    const prompt = `Analyze this project data: ${JSON.stringify(project)} and generate a project health dashboard report.`;

    try {
      const result = await intelligenceExecutor.execute(
        prompt,
        AiIntelligenceResponseSchema,
        { projectId, userId: user.id }
      );
      return reply.send({ success: true, data: result });
    } catch (err: any) {
      return reply.status(500).send({ success: false, message: err.message });
    }
  });
}
