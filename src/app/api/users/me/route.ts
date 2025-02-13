import { errorResponse, successResponse } from "@/utils/apiResponse";
import { getProfile } from "@/server/users/service";
import { withAuth } from "@/utils/withAuth";
import type { JwtPayload } from "@/utils/jwt";
import type { NextRequest } from "next/server";
import { ClientError } from "@/utils/error";

async function handler(_: NextRequest, jwtPayload: JwtPayload) {
  try {
    const profile = await getProfile({ id: jwtPayload.userId });
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

export const GET = withAuth(handler);
