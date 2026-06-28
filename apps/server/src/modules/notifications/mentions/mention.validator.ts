import { db } from "../../../db";
import { MentionValidationError } from "../errors";
import { notificationLogger } from "../logger";

const LOG_CTX = "MentionValidator";

export interface ValidatedMention {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
}

/**
 * Validates that mentioned users exist and (optionally) have workspace access.
 */
export class MentionValidator {
  /**
   * Validate a list of usernames.
   * Returns an array of validated user objects.
   * Throws MentionValidationError for unknown users.
   */
  async validate(
    usernames: string[],
    workspaceId?: string
  ): Promise<ValidatedMention[]> {
    const validated: ValidatedMention[] = [];

    for (const username of usernames) {
      // Match by email prefix or firstName+lastName (flexible lookup)
      const user = await db.user.findFirst({
        where: {
          OR: [
            { email: { startsWith: username, mode: "insensitive" } },
            { firstName: { equals: username, mode: "insensitive" } },
          ],
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          workspaceMembers: workspaceId
            ? { where: { workspaceId }, select: { id: true } }
            : undefined,
        },
      });

      if (!user) {
        notificationLogger.warn(LOG_CTX, `Mentioned user not found: @${username}`);
        throw new MentionValidationError(username);
      }

      // If workspaceId provided, ensure user is a member
      if (workspaceId && (!user.workspaceMembers || user.workspaceMembers.length === 0)) {
        notificationLogger.warn(LOG_CTX, `Mentioned user not in workspace: @${username}`);
        throw new MentionValidationError(username);
      }

      validated.push({
        userId: user.id,
        username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }

    return validated;
  }
}

export const mentionValidator = new MentionValidator();
