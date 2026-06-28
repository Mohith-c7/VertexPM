import { NotificationType } from "../types";
import { templateRegistry, NotificationTemplate } from "./template.registry";
import { notificationLogger } from "../logger";

const LOG_CTX = "TemplateEngine";

/**
 * Renders a notification template by interpolating `{{variable}}` placeholders.
 */
export class TemplateEngine {
  /**
   * Render a template for the given notification type with the provided variables.
   * Falls back to raw title/body if template not found.
   */
  render(
    type: NotificationType,
    variables: Record<string, string | undefined>,
    override?: Partial<NotificationTemplate>
  ): { title: string; body: string } {
    const template = templateRegistry.get(type);

    if (!template) {
      notificationLogger.warn(LOG_CTX, `No template found for type: ${type}`);
      return {
        title: override?.title ?? type,
        body: override?.body ?? "",
      };
    }

    const title = this.interpolate(override?.title ?? template.title, variables);
    const body = this.interpolate(override?.body ?? template.body, variables);

    return { title, body };
  }

  private interpolate(text: string, vars: Record<string, string | undefined>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
  }
}

export const templateEngine = new TemplateEngine();
