import { PromptTemplate } from '../types';

export class PromptEngine {
  private templates: Map<string, PromptTemplate> = new Map();

  register(template: PromptTemplate) {
    this.templates.set(template.id, template);
  }

  get(id: string): PromptTemplate {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Prompt template with ID ${id} not found.`);
    }
    return template;
  }

  build(id: string, variables: Record<string, any> = {}): string {
    const templateData = this.get(id);
    let result = templateData.template;

    const mergedVariables = { ...templateData.defaults, ...variables };

    for (const [key, value] of Object.entries(mergedVariables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    return result;
  }
}

export const promptEngine = new PromptEngine();
