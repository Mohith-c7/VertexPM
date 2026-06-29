import { describe, it, expect, vi, beforeEach } from "vitest";
import { AutomationExecutor } from "../../modules/automation/engine/automation.executor";
import { LoopPreventionError } from "../../modules/automation/errors";
import { db } from "../../db";
import { MAX_EXECUTION_DEPTH } from "../../modules/automation/constants";

// Mock database
vi.mock("../../db", () => ({
  db: {
    executionLog: {
      findFirst: vi.fn(),
    },
    automationRule: {
      update: vi.fn(),
    },
  },
}));

// Mock logs and components
vi.mock("../../modules/automation/logger", () => ({
  automationLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("AutomationExecutor Loop Prevention", () => {
  let executor: AutomationExecutor;

  beforeEach(() => {
    executor = new AutomationExecutor();
    vi.clearAllMocks();
  });

  it("should prevent execution when depth exceeds limit", async () => {
    const mockRule = { id: "rule-1", workspaceId: "ws-1", actions: "[]" } as any;
    const context = {
      depth: MAX_EXECUTION_DEPTH + 1,
      executedRuleIds: new Set<string>(),
      actorId: "user-1",
      eventTimestamp: Date.now(),
      triggerEvent: {} as any,
    };

    await expect(
      executor.executeRule(mockRule, "item-1", "WorkItem", context)
    ).rejects.toThrow(LoopPreventionError);
  });

  it("should prevent direct recursive chain execution", async () => {
    const mockRule = { id: "rule-1", workspaceId: "ws-1", actions: "[]" } as any;
    const context = {
      depth: 1,
      executedRuleIds: new Set<string>(["rule-1"]),
      actorId: "user-1",
      eventTimestamp: Date.now(),
      triggerEvent: {} as any,
    };

    await expect(
      executor.executeRule(mockRule, "item-1", "WorkItem", context)
    ).rejects.toThrow(LoopPreventionError);
  });

  it("should prevent execution if executed within the last 1 second", async () => {
    const mockRule = { id: "rule-1", workspaceId: "ws-1", actions: "[]" } as any;
    const context = {
      depth: 1,
      executedRuleIds: new Set<string>(),
      actorId: "user-1",
      eventTimestamp: Date.now(),
      triggerEvent: {} as any,
    };

    vi.mocked(db.executionLog.findFirst).mockResolvedValue({ id: "log-1" } as any);

    await executor.executeRule(mockRule, "item-1", "WorkItem", context);

    expect(db.automationRule.update).not.toHaveBeenCalled();
  });
});
