import type { FastifyInstance } from "fastify";
import { handleSignup, handleLogin, handleLogout, handleRefresh, handleMe } from "./auth.controller";
import { requireAuth } from "../../middleware/auth.middleware";

export async function authRoutes(app: FastifyInstance) {
  app.post("/signup", handleSignup);
  app.post("/login", handleLogin);
  app.post("/refresh", handleRefresh);
  
  app.post("/logout", { preHandler: [requireAuth] }, handleLogout);
  app.get("/me", { preHandler: [requireAuth] }, handleMe);
}
