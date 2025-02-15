import { errorResponse, successResponse } from "@/utils/apiResponse";
import { getUser } from "@/server/users/service";
import { requireAuth } from "@/utils/auth";
import { NextResponse } from "next/server";
import { ClientError } from "@/utils/error";

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const profile = await getUser({ id: user.userId });
    return successResponse("Profile fetched successfully", profile);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to fetch profile", 500, error);
  }
}
