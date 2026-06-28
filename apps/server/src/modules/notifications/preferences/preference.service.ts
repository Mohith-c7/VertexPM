import { db } from "../../../db";
import { NotificationPreference } from "@prisma/client";
import { ParsedPreferences } from "../types";
import { notificationLogger } from "../logger";

const LOG_CTX = "PreferenceService";

export class PreferenceService {
  /**
   * Get preferences for a user (with optional workspace/project scope).
   * Falls back to global user preferences if scoped not found.
   */
  async getPreferences(
    userId: string,
    workspaceId?: string,
    projectId?: string
  ): Promise<NotificationPreference | null> {
    // Try most-specific first
    if (projectId) {
      const pref = await db.notificationPreference.findFirst({
        where: { userId, projectId },
      });
      if (pref) return pref;
    }
    if (workspaceId) {
      const pref = await db.notificationPreference.findFirst({
        where: { userId, workspaceId, projectId: null },
      });
      if (pref) return pref;
    }
    // Global
    return db.notificationPreference.findFirst({
      where: { userId, workspaceId: null, projectId: null },
    });
  }

  /** Get all preference rows for a user */
  async getAllForUser(userId: string): Promise<NotificationPreference[]> {
    return db.notificationPreference.findMany({ where: { userId } });
  }

  /** Upsert preferences */
  async upsertPreferences(
    userId: string,
    data: {
      workspaceId?: string;
      projectId?: string;
      types?: string[];
      channels?: string[];
      quietHours?: object;
      digestFreq?: string;
    }
  ): Promise<NotificationPreference> {
    notificationLogger.info(LOG_CTX, "Upserting preferences", { userId });

    const where = {
      userId_workspaceId_projectId: {
        userId,
        workspaceId: data.workspaceId ?? null,
        projectId: data.projectId ?? null,
      },
    } as any;


    const payload = {
      types: JSON.stringify(data.types ?? []),
      channels: JSON.stringify(data.channels ?? ["IN_APP"]),
      quietHours: data.quietHours ? JSON.stringify(data.quietHours) : undefined,
      digestFreq: data.digestFreq,
    };

    return db.notificationPreference.upsert({
      where,
      update: payload,
      create: {
        userId,
        workspaceId: data.workspaceId ?? null,
        projectId: data.projectId ?? null,
        ...payload,
      },
    });
  }

  /** Parse raw preference row to typed object */
  parsePreferences(pref: NotificationPreference): ParsedPreferences {
    return {
      types: JSON.parse(pref.types),
      channels: JSON.parse(pref.channels),
      quietHours: pref.quietHours ? JSON.parse(pref.quietHours) : undefined,
      digestFreq: pref.digestFreq ?? undefined,
    };
  }

  /** Check if current time is within quiet hours */
  isQuietHour(pref: NotificationPreference): boolean {
    if (!pref.quietHours) return false;
    const parsed = JSON.parse(pref.quietHours) as { enabled: boolean; startHour: number; endHour: number };
    if (!parsed.enabled) return false;
    const hour = new Date().getHours();
    if (parsed.startHour <= parsed.endHour) {
      return hour >= parsed.startHour && hour < parsed.endHour;
    }
    // Wraps midnight
    return hour >= parsed.startHour || hour < parsed.endHour;
  }
}

export const preferenceService = new PreferenceService();
