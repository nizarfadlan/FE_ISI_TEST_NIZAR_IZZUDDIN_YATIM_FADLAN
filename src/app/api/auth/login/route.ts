import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  JWT_EXPIRATION,
  JWT_EXPIRATION_REFRESH,
} from "@/constant";
import { env } from "@/env";
import { loginUser } from "@/server/auth/service";
import { loginFormRequestSchema } from "@/server/auth/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const validation = await validateRequest(request, loginFormRequestSchema);

  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { data } = validation;
    const response = await loginUser(data);

    const cookieStore = await cookies();
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

    return successResponse("Successfully logged in");
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
      "An error occurred while logging in",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
