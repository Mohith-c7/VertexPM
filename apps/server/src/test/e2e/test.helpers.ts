import { db } from "../../db.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

export const TEST_USER_PREFIX = "e2e-test-";
export const TEST_WORKSPACE_PREFIX = "[E2E-TEST]";

export async function cleanupDatabase() {
  try {
    // 1. Delete test workspaces (cascading takes care of their dependencies)
    await db.workspace.deleteMany({
      where: {
        name: {
          startsWith: TEST_WORKSPACE_PREFIX,
        },
      },
    });

    // 2. Delete test users
    await db.user.deleteMany({
      where: {
        email: {
          startsWith: TEST_USER_PREFIX,
        },
      },
    });
  } catch (err: any) {
    console.error("Database cleanup error:", err.message);
  }
}

export function generateTestEmail(name: string): string {
  return `${TEST_USER_PREFIX}${name}-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateTestWorkspaceName(name: string): string {
  return `${TEST_WORKSPACE_PREFIX} ${name} ${Math.random().toString(36).substring(7)}`;
}
