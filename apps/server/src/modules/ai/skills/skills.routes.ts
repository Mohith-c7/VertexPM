import { FastifyInstance } from 'fastify';
import { SkillEngine } from './skill.engine';
import { SkillValidator } from './skill.validator';
import { executeSkillSchema, generationSkillSchema, writingSkillSchema, estimationSkillSchema } from '@vertexpm/validation';
import { skillLogger } from './skill.logger';
import { requireAuth } from '../../../middleware/auth.middleware';

export async function skillsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth as any);

  app.get('/', async (req, reply) => {
    try {
      const skills = SkillEngine.getSkills();
      return skills.map(s => ({ id: s.id, name: s.name, description: s.description, category: s.category }));
    } catch (error: any) {
      reply.status(500).send({ error: error.message });
    }
  });

  app.post('/execute', async (req, reply) => {
    try {
      const body = SkillValidator.validateInput('execute-skill', executeSkillSchema, req.body as any);
      const { skillId, input, context, options } = (body as any).body;
      
      const enrichedContext = { ...context, userId: (req as any).user?.id };
      const result = await SkillEngine.execute(skillId, input, enrichedContext, options);
      return result;
    } catch (error: any) {
      skillLogger.error('Error executing skill', error);
      reply.status(error.code ? 400 : 500).send({ error: error.message, code: error.code });
    }
  });

  app.post('/generation/:type', async (req, reply) => {
    try {
      const type = (req.params as any).type;
      const body = SkillValidator.validateInput(`generation-${type}`, generationSkillSchema, req.body as any);
      const parsedBody = (body as any).body;
      
      const skillId = `generation-${type}`;
      const enrichedContext = { ...parsedBody.context, userId: (req as any).user?.id };
      
      const result = await SkillEngine.execute(skillId, parsedBody, enrichedContext);
      return result;
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  });

  app.post('/writing/:action', async (req, reply) => {
    try {
      const action = (req.params as any).action;
      const body = SkillValidator.validateInput(`writing-${action}`, writingSkillSchema, req.body as any);
      const parsedBody = (body as any).body;
      
      const skillId = `writing-${action}`;
      const enrichedContext = { ...parsedBody.context, userId: (req as any).user?.id };
      
      const result = await SkillEngine.execute(skillId, parsedBody, enrichedContext);
      return result;
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  });

  app.post('/estimation/:type', async (req, reply) => {
    try {
      const type = (req.params as any).type;
      const body = SkillValidator.validateInput(`estimation-${type}`, estimationSkillSchema, req.body as any);
      const parsedBody = (body as any).body;
      
      const skillId = `estimation-${type}`;
      const enrichedContext = { ...parsedBody.context, userId: (req as any).user?.id };
      
      const result = await SkillEngine.execute(skillId, parsedBody, enrichedContext);
      return result;
    } catch (error: any) {
      reply.status(400).send({ error: error.message });
    }
  });
}
