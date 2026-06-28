import bcrypt from "bcrypt";
import crypto from "crypto";
import { db } from "../../db";
import { createUser, findUserByEmail, sanitizeUser } from "../users/users.service";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import type { SignupInput, LoginInput } from "@vertexpm/validation";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function signup(input: SignupInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await createUser({
    email: input.email,
    passwordHash,
    firstName: input.firstName,
    lastName: input.lastName,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function login(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

export async function refreshTokens(oldRefreshToken: string) {
  const hashedToken = hashToken(oldRefreshToken);
  
  const tokenRecord = await db.refreshToken.findUnique({
    where: { tokenHash: hashedToken },
    include: { user: true }
  });

  if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  await db.refreshToken.delete({ where: { id: tokenRecord.id } });

  const accessToken = generateAccessToken(tokenRecord.userId);
  const refreshToken = generateRefreshToken(tokenRecord.userId);

  await db.refreshToken.create({
    data: {
      userId: tokenRecord.userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: sanitizeUser(tokenRecord.user), accessToken, refreshToken };
}

export async function logout(userId: string) {
  await db.refreshToken.deleteMany({
    where: { userId },
  });
}
