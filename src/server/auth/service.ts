import { env } from "@/env";
import { db } from "../db";
import { refreshToken, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { signJwt, verifyJwt, type JwtPayload } from "@/utils/jwt";
import { JWT_EXPIRATION, JWT_EXPIRATION_REFRESH } from "@/constant";
import type {
  LoginFormRequestDTO,
  LoginFormResponseDTO,
  LogoutRequestDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
} from "./type";

const secret = new TextEncoder().encode(env.JWT_SECRET);
const secretRefresh = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function loginUser(
  data: LoginFormRequestDTO,
): Promise<LoginFormResponseDTO> {
  const { username, password } = data;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const check = await compare(password, user.password);

  if (!check) {
    throw new Error("Invalid credentials");
  }

  const payload: JwtPayload = { userId: user.id, role: user.role };

  const newAccessToken = await signJwt(payload, JWT_EXPIRATION, secret);
  const newRefreshToken = await signJwt(
    payload,
    JWT_EXPIRATION_REFRESH,
    secretRefresh,
  );

  const refreshTokenExpiresIn = new Date(
    Date.now() + JWT_EXPIRATION_REFRESH * 1000,
  );
  await db.insert(refreshToken).values({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: refreshTokenExpiresIn,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function refreshUserToken(
  data: RefreshTokenRequestDTO,
): Promise<RefreshTokenResponseDTO> {
  const { refreshToken: token } = data;

  const verifyToken = (await verifyJwt(token, secretRefresh)) as JwtPayload;
  if (!verifyToken) {
    throw new Error("Invalid token");
  }

  const storedToken = await db.query.refreshToken.findFirst({
    where: eq(refreshToken.token, token),
  });
  if (!storedToken) {
    throw new Error("Invalid token");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, verifyToken.userId),
  });
  if (!user) {
    throw new Error("User not found");
  }

  await db.delete(refreshToken).where(eq(refreshToken.token, refreshToken));

  const payload: JwtPayload = { userId: user.id, role: user.role };

  const newAccessToken = await signJwt(payload, JWT_EXPIRATION, secret);
  const newRefreshToken = await signJwt(
    payload,
    JWT_EXPIRATION_REFRESH,
    secretRefresh,
  );

  const refreshTokenExpiresIn = new Date(
    Date.now() + JWT_EXPIRATION_REFRESH * 1000,
  );
  await db.insert(refreshToken).values({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: refreshTokenExpiresIn,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(data: LogoutRequestDTO) {
  const { refreshToken: token } = data;
  if (!token) {
    throw new Error("Not logged in");
  }

  await db.delete(refreshToken).where(eq(refreshToken.token, token));
}
