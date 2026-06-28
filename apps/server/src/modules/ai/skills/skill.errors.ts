export class SkillError extends Error {
  constructor(message: string, public readonly code: string = 'SKILL_ERROR') {
    super(message);
    this.name = 'SkillError';
  }
}

export class SkillNotFoundError extends SkillError {
  constructor(skillId: string) {
    super(`Skill not found: ${skillId}`, 'SKILL_NOT_FOUND');
  }
}

export class SkillExecutionError extends SkillError {
  constructor(skillId: string, message: string) {
    super(`Execution failed for skill ${skillId}: ${message}`, 'SKILL_EXECUTION_FAILED');
  }
}

export class SkillValidationError extends SkillError {
  constructor(skillId: string, message: string) {
    super(`Validation failed for skill ${skillId}: ${message}`, 'SKILL_VALIDATION_FAILED');
  }
}
