import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  JWT_EXPIRATION,
  JWT_EXPIRATION_REFRESH,
} from "@/constant";
import { env } from "@/env";
import { refreshUserToken } from "@/server/auth/service";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(COOKIE_REFRESH_TOKEN);

    console.log("refreshToken", refreshToken);

    if (!refreshToken) {
      return errorResponse("No refresh token found", 400);
    }

    const response = await refreshUserToken({
      refreshToken: refreshToken?.value,
    });

    cookieStore.set(COOKIE_ACCESS_TOKEN, response.accessToken, {
      maxAge: JWT_EXPIRATION,
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    cookieStore.set(COOKIE_REFRESH_TOKEN, response.refreshToken, {
      maxAge: JWT_EXPIRATION_REFRESH,
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
    });

    return successResponse("Successfully refreshed token", {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse(
      "An error occurred while refreshing the token",
      500,
      error,
    );
  }
}
