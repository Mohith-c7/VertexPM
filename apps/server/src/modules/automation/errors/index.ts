export class AutomationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AutomationError";
  }
}

export class AutomationRuleNotFoundError extends AutomationError {
  constructor(id: string) {
    super(`Automation rule '${id}' not found`, "AUTOMATION_RULE_NOT_FOUND", 404);
    this.name = "AutomationRuleNotFoundError";
  }
}

export class AutomationRuleUnauthorizedError extends AutomationError {
  constructor() {
    super("Unauthorized to access this automation rule", "AUTOMATION_RULE_UNAUTHORIZED", 403);
    this.name = "AutomationRuleUnauthorizedError";
  }
}

export class AutomationValidationError extends AutomationError {
  constructor(message: string) {
    super(message, "AUTOMATION_VALIDATION_ERROR", 400);
    this.name = "AutomationValidationError";
  }
}

export class LoopPreventionError extends AutomationError {
  constructor(message: string) {
    super(message, "AUTOMATION_LOOP_PREVENTED", 400);
    this.name = "LoopPreventionError";
  }
}

export class SchedulerError extends AutomationError {
  constructor(message: string, code: string = "SCHEDULER_ERROR") {
    super(message, code, 500);
    this.name = "SchedulerError";
  }
}
