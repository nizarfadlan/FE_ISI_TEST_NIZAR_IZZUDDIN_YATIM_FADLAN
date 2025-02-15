import { errorResponse, successResponse } from "@/utils/apiResponse";
import { getUser } from "@/server/users/service";
import { requireAuth } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ClientError } from "@/utils/error";
import { HttpStatus } from "@/types/httpStatus.enum";
import { cookies } from "next/headers";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/constant";

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const profile = await getUser({ id: user.userId });
    return successResponse("Profile fetched successfully", profile);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();

      if (errorClient.status === HttpStatus.NOT_FOUND) {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_ACCESS_TOKEN);
        cookieStore.delete(COOKIE_REFRESH_TOKEN);
      }

      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to fetch profile", 500, error);
  }
}
