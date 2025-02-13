import { jwtVerify, SignJWT, type JWTPayload } from "jose";

export interface JwtPayload extends JWTPayload {
  userId: number;
  role: string;
}

export async function signJwt(
  payload: JwtPayload,
  expiresIn: number,
  secret: Uint8Array,
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secret);
}

export async function verifyJwt(token: string, secret: Uint8Array) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}
