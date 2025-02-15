import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/constant";
import { logoutUser } from "@/server/auth/service";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { requireAuth } from "@/utils/auth";
import { ClientError } from "@/utils/error";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const cookieStore = await cookies();

    await logoutUser({
      userId: user.userId,
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

    return errorResponse(
      "An error occurred while logging out",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
