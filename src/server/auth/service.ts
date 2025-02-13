import { env } from "@/env";
import { db } from "../db";
import { refreshToken, users } from "../db/schema";
import { signJwt, verifyJwt, type JwtPayload } from "@/utils/jwt";
import { JWT_EXPIRATION, JWT_EXPIRATION_REFRESH } from "@/constant";
import type {
  LoginFormRequestDTO,
  LoginFormResponseDTO,
  LogoutRequestDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
} from "./type";
import { comparePassword } from "@/utils/bcrypt";
import { ClientError } from "@/utils/error";
import { HttpStatus } from "@/types/httpStatus.enum";
import { eq } from "drizzle-orm";
import { useAuthStore } from "@/store/useAuthStore";

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
    throw new ClientError("Invalid credentials", HttpStatus.BAD_REQUEST);
  }

  const check = await comparePassword(password, user.password);

  if (!check) {
    throw new ClientError("Invalid credentials", HttpStatus.BAD_REQUEST);
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

  const verifyToken = (await verifyJwt(token, secretRefresh))!;
  if (!verifyToken) {
    throw new ClientError("Invalid token", HttpStatus.BAD_REQUEST);
  }

  const storedToken = await db.query.refreshToken.findFirst({
    where: eq(refreshToken.token, token),
  });
  if (!storedToken) {
    throw new ClientError("Invalid token", HttpStatus.BAD_REQUEST);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, verifyToken.userId),
  });
  if (!user) {
    throw new ClientError("User not found", HttpStatus.NOT_FOUND);
  }

  useAuthStore.setState({ user });
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
  const { userId } = data;

  await db.delete(refreshToken).where(eq(refreshToken.userId, userId));
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const verify = await verifyJwt(token, secret);

  if (!verify) {
    throw new ClientError("Invalid or expired token", HttpStatus.UNAUTHORIZED);
  }

  return verify;
}
