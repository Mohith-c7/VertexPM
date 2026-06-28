import { db } from "../../../db";
import { mentionParser } from "./mention.parser";
import { mentionValidator, ValidatedMention } from "./mention.validator";
import { notificationLogger } from "../logger";
import { DuplicateMentionError } from "../errors";

const LOG_CTX = "MentionDetector";

export interface DetectedMention extends ValidatedMention {
  isDuplicate: boolean;
}

/**
 * Orchestrates mention detection: parse → validate → dedup → return valid new mentions.
 */
export class MentionDetector {
  /**
   * Process comment content and return new (non-duplicate) mentions.
   * @param content    The comment text
   * @param commentId  The ID of the comment (for duplicate check)
   * @param actorId    The user writing the comment (exclude self-mentions)
   * @param workspaceId Optional workspace to scope access validation
   */
  async detect(
    content: string,
    commentId: string,
    actorId: string,
    workspaceId?: string
  ): Promise<ValidatedMention[]> {
    const usernames = mentionParser.parse(content);
    if (usernames.length === 0) return [];

    notificationLogger.info(LOG_CTX, `Detected ${usernames.length} mention(s)`, { commentId });

    let validated: ValidatedMention[];
    try {
      validated = await mentionValidator.validate(usernames, workspaceId);
    } catch (err) {
      notificationLogger.warn(LOG_CTX, "Mention validation failed, skipping mentions", { error: String(err) });
      return [];
    }

    // Filter out self-mentions
    const nonSelf = validated.filter((m) => m.userId !== actorId);

    // Check duplicates against existing Mention records in DB
    const newMentions: ValidatedMention[] = [];
    for (const mention of nonSelf) {
      const existing = await db.mention.findFirst({
        where: { commentId, mentionedUserId: mention.userId },
      });

      if (existing) {
        notificationLogger.debug(LOG_CTX, `Duplicate mention skipped`, {
          commentId,
          userId: mention.userId,
        });
        continue;
      }

      // Persist Mention record for dedup tracking
      await db.mention.create({
        data: {
          commentId,
          mentionedUserId: mention.userId,
        },
      });

      newMentions.push(mention);
    }

    notificationLogger.info(LOG_CTX, `${newMentions.length} new mention(s) to notify`);
    return newMentions;
  }
}

export const mentionDetector = new MentionDetector();
