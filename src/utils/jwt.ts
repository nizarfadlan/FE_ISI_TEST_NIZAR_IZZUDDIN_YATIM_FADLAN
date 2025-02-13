import { JWT_ALGORITHM } from "@/constant";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export interface JwtPayload extends JWTPayload {
  userId: string;
  role: string;
}

export async function signJwt(
  payload: JwtPayload,
  expiresIn: number,
  secret: Uint8Array,
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secret);
}

export async function verifyJwt(
  token: string,
  secret: Uint8Array,
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [JWT_ALGORITHM],
    });
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
