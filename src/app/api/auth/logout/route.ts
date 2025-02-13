import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/constant";
import { logoutUser } from "@/server/auth/service";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { withAuth } from "@/utils/withAuth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

async function handler(_: NextRequest, jwtPayload: JwtPayload) {
  try {
    const cookieStore = await cookies();

    await logoutUser({
      userId: jwtPayload.userId,
    });
    cookieStore.delete(COOKIE_ACCESS_TOKEN);
    cookieStore.delete(COOKIE_REFRESH_TOKEN);

    return successResponse("Successfully logged out");
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("An error occurred while logging out", 500, error);
  }
}

export const POST = withAuth(handler);
