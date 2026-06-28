import { FastifyInstance } from 'fastify';
import { intelligenceEngine } from './intelligence.engine';

export async function intelligenceRoutes(fastify: FastifyInstance) {
  fastify.post('/api/ai/intelligence/sprint-plan', async (request, reply) => {
    const result = await intelligenceEngine.sprintPlanner.plan(request.body);
    return reply.send(result);
  });
  
  fastify.post('/api/ai/intelligence/project-summary', async (request, reply) => {
    const result = await intelligenceEngine.projectSummary.analyze(request.body);
    return reply.send(result);
  });
}
