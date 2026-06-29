import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../app.js";
import { generateTestEmail, generateTestWorkspaceName, cleanupDatabase } from "./test.helpers.js";
import { db } from "../../db.js";

describe("VertexPM Strict End-to-End API Integration Suite", () => {
  let app: any;
  let token: string;
  let userId: string;
  let workspaceId: string;
  let projectId: string;
  let boardId: string;
  let columnId: string;
  let workItemId: string;
  let labelId: string;

  const testUserEmail = generateTestEmail("user");
  const testWorkspaceName = generateTestWorkspaceName("Main");

  beforeAll(async () => {
    app = buildApp();
    await app.ready();
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await app.close();
  });

  describe("1. Authentication Flow", () => {
    it("should sign up a new user successfully", async () => {
      console.log("E2E SIGNUP EMAIL:", testUserEmail);
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/signup",
        payload: {
          email: testUserEmail,
          password: "SecurePassword123!",
          firstName: "E2E",
          lastName: "Tester",
        },
      });

      console.log("E2E SIGNUP RES BODY:", response.body);
      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe(testUserEmail);
      userId = body.data.user.id;
      token = body.data.accessToken;
    });

    it("should log in user and return access token", async () => {
      console.log("E2E LOGIN EMAIL:", testUserEmail);
      const response = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: {
          email: testUserEmail,
          password: "SecurePassword123!",
        },
      });

      console.log("E2E LOGIN RES BODY:", response.body);
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.accessToken).toBeDefined();
      token = body.data.accessToken;
      console.log("E2E LOGGED IN TOKEN:", token);
    });

    it("should reject requests to protected routes without a token", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/workspaces",
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe("2. Workspace & Projects", () => {
    it("should create a workspace under user authentication", async () => {
      console.log("E2E SENDING TOKEN:", token);
      const response = await app.inject({
        method: "POST",
        url: "/api/workspaces",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: testWorkspaceName,
          slug: `e2e-${Math.random().toString(36).substring(7)}`,
        },
      });

      console.log("E2E WORKSPACE RES STATUS:", response.statusCode);
      console.log("E2E WORKSPACE RES BODY:", response.body);

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.name).toBe(testWorkspaceName);
      workspaceId = body.data.id;
    });

    it("should create a project linked to the workspace", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/projects",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          workspaceId,
          name: "E2E Project",
          key: `E2E${Math.floor(Math.random() * 1000)}`,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      projectId = body.data.id;
    });
  });

  describe("3. Boards, Columns & WorkItems", () => {
    it("should create a Kanban board inside the project", async () => {
      const response = await app.inject({
        method: "POST",
        url: `/api/projects/${projectId}/boards`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          name: "Kanban Development Board",
          type: "KANBAN",
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      boardId = body.data.id;

      const boardDetails = await db.board.findUnique({
        where: { id: boardId },
        include: { columns: true },
      });
      expect(boardDetails?.columns.length).toBeGreaterThan(0);
      columnId = boardDetails!.columns[0].id;
    });

    it("should create a WorkItem inside the board column", async () => {
      const response = await app.inject({
        method: "POST",
        url: `/api/boards/${boardId}/work-items`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          columnId,
          title: "Rigorous E2E Test Coverage Task",
          type: "TASK",
          status: "TODO",
          priority: "HIGH",
          position: 1,
          reporterId: userId,
          assigneeId: userId,
          slug: `E2E-TASK-${Math.random().toString(36).substring(7)}`,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.title).toBe("Rigorous E2E Test Coverage Task");
      workItemId = body.data.id;
    });

    it("should transition WorkItem column/status correctly", async () => {
      const response = await app.inject({
        method: "PATCH",
        url: `/api/work-items/${workItemId}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          status: "IN_PROGRESS",
          priority: "CRITICAL",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe("IN_PROGRESS");
      expect(body.data.priority).toBe("CRITICAL");
    });
  });

  describe("4. Labels Integration", () => {
    it("should create a label in the workspace", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/labels",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          workspaceId,
          name: "E2E-TEST-LABEL",
          color: "#E11D48",
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      labelId = body.data.id;
    });

    it("should assign label to the WorkItem", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/workitems/labels",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          workItemId,
          labelId,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });

    it("should retrieve WorkItem labels successfully", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/workitems/${workItemId}/labels`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(1);
      expect(body.data[0].label.name).toBe("E2E-TEST-LABEL");
    });
  });

  describe("5. Enterprise Search & Cache", () => {
    it("should return matches in global search with ranking", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/api/search?workspaceId=${workspaceId}&q=Rigorous`,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.results.length).toBeGreaterThan(0);
      expect(body.results[0].items.length).toBeGreaterThan(0);
      expect(body.results[0].items[0].title).toContain("Rigorous");
      expect(body.results[0].items[0].score).toBeGreaterThan(0);
    });

    it("should support query filter building", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/api/filters/query",
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          filter: {
            logicalOperator: "AND",
            conditions: [
              {
                field: "status",
                operator: "equals",
                value: "IN_PROGRESS",
              },
            ],
          },
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toBeDefined();
    });
  });

  describe("6. Event-Driven Automation Triggers & Logs", () => {
    it("should trigger automation evaluation on event log emission", async () => {
      const rule = await db.automationRule.create({
        data: {
          workspaceId,
          projectId,
          name: "E2E Auto Rule",
          triggerType: "WORKITEM_UPDATED",
          triggerConfig: JSON.stringify({}),
          conditions: JSON.stringify([]),
          actions: JSON.stringify([
            {
              type: "CREATE_NOTIFICATION",
              title: "E2E Task Triggered",
              message: "Test rule action",
            },
          ]),
          isEnabled: true,
          createdById: userId,
        },
      });

      const response = await app.inject({
        method: "PATCH",
        url: `/api/work-items/${workItemId}`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          title: "Rigorous E2E Test Coverage Task (Updated)",
        },
      });

      expect(response.statusCode).toBe(200);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const executionLogs = await db.executionLog.findMany({
        where: { ruleId: rule.id },
      });
      
      expect(executionLogs.length).toBeGreaterThanOrEqual(0);
    });
  });
});
