// ─── Custom Error Classes ──────────────────────────────────────────────────────

export class NotificationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "NotificationError";
  }
}

export class NotificationNotFoundError extends NotificationError {
  constructor(id: string) {
    super(`Notification '${id}' not found`, "NOTIFICATION_NOT_FOUND", 404);
    this.name = "NotificationNotFoundError";
  }
}

export class NotificationUnauthorizedError extends NotificationError {
  constructor() {
    super("Unauthorized to perform this action on the notification", "NOTIFICATION_UNAUTHORIZED", 403);
    this.name = "NotificationUnauthorizedError";
  }
}

export class NotificationPreferenceNotFoundError extends NotificationError {
  constructor(userId: string) {
    super(`Notification preferences for user '${userId}' not found`, "PREFERENCE_NOT_FOUND", 404);
    this.name = "NotificationPreferenceNotFoundError";
  }
}

export class MentionValidationError extends NotificationError {
  constructor(username: string) {
    super(`User '${username}' not found or has no access`, "MENTION_INVALID_USER", 400);
    this.name = "MentionValidationError";
  }
}

export class DuplicateMentionError extends NotificationError {
  constructor(userId: string, commentId: string) {
    super(`User '${userId}' was already mentioned in comment '${commentId}'`, "DUPLICATE_MENTION", 409);
    this.name = "DuplicateMentionError";
  }
}
