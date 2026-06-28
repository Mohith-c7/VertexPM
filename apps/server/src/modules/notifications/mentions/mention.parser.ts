import { MENTION_REGEX } from "../constants";

/**
 * Parses @username mentions from comment/text content.
 */
export class MentionParser {
  /**
   * Extract all @username strings from content.
   * Returns deduplicated list of usernames (without the @ prefix).
   */
  parse(content: string): string[] {
    const matches = content.matchAll(new RegExp(MENTION_REGEX.source, "g"));
    const usernames = new Set<string>();
    for (const match of matches) {
      usernames.add(match[1].toLowerCase());
    }
    return Array.from(usernames);
  }

  /**
   * Check if content contains any @mentions.
   */
  hasMentions(content: string): boolean {
    return MENTION_REGEX.test(content);
  }

  /**
   * Replace @username with a display-friendly string.
   */
  highlight(content: string, replacer: (username: string) => string): string {
    return content.replace(new RegExp(MENTION_REGEX.source, "g"), (_, username) => replacer(username));
  }
}

export const mentionParser = new MentionParser();
