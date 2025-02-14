import { updateUser } from "@/server/users/service";
import { updateUserRequestSchema } from "@/server/users/type";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { validateRequest } from "@/utils/validation";
import { withAuth } from "@/utils/withAuth";
import { NextResponse, type NextRequest } from "next/server";

async function handlerUpdate(req: NextRequest, jwtPayload: JwtPayload) {
  const validation = await validateRequest(req, updateUserRequestSchema);

  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { userId } = jwtPayload;
    const { data } = validation;
    const response = await updateUser(data, userId);

    return successResponse("User updated successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to update user", 500, error);
  }
}
export const PATCH = withAuth(handlerUpdate);
