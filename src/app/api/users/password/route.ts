import { updatePassword } from "@/server/users/service";
import { updatePasswordRequestSchema } from "@/server/users/type";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { requireAuth } from "@/utils/auth";
import { NextResponse, type NextRequest } from "next/server";
import { HttpStatus } from "@/types/httpStatus.enum";

export async function PATCH(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const validation = await validateRequest(
    request,
    updatePasswordRequestSchema,
  );
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { userId } = user;
    const { data } = validation;
    const response = await updatePassword(data, userId);

    return successResponse("Password updated successfully", response);
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
      "Failed to update password",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
