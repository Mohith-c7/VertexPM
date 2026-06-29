import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireAuth } from "../../middleware/auth.middleware";
import { verifyAccessToken } from "../../utils/jwt";

vi.mock("../../utils/jwt", () => ({
  verifyAccessToken: vi.fn(),
}));

describe("Authentication Middleware", () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  it("should block request without Authorization header", async () => {
    await requireAuth(mockRequest, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalled();
  });

  it("should block request with malformed Authorization header", async () => {
    mockRequest.headers.authorization = "Basic xyz";
    await requireAuth(mockRequest, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
  });

  it("should set request.user on valid JWT token", async () => {
    mockRequest.headers.authorization = "Bearer valid-token";
    vi.mocked(verifyAccessToken).mockReturnValue({ userId: "user-123" } as any);

    await requireAuth(mockRequest, mockReply);
    expect(mockRequest.user).toEqual({ id: "user-123" });
    expect(mockReply.status).not.toHaveBeenCalled();
  });

  it("should block request on invalid JWT token", async () => {
    mockRequest.headers.authorization = "Bearer invalid-token";
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await requireAuth(mockRequest, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockRequest.user).toBeUndefined();
  });
});
