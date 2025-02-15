import { cookies } from "next/headers";
import { verifyAccessToken } from "@/server/auth/service";
import { COOKIE_ACCESS_TOKEN } from "@/constant";
import { errorResponse } from "./apiResponse";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN);

  if (!accessToken) {
    return null;
  }

  try {
    const verify = await verifyAccessToken(accessToken.value);
    return verify;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getUserFromToken();

  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  return user;
}
