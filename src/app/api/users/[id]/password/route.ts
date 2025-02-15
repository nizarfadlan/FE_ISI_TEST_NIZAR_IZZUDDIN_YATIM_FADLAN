import { updatePassword } from "@/server/users/service";
import { updatePasswordRequestSchema } from "@/server/users/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { requireAuth } from "@/utils/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to update user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { data } = validation;
    const { id } = await params;
    const response = await updatePassword(data, id);

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
