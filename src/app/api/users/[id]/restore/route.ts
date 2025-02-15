import { restoreUser } from "@/server/users/service";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { requireAuth } from "@/utils/auth";
import { ClientError } from "@/utils/error";
import { NextResponse, type NextRequest } from "next/server";

export async function PATCH(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to restore user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { id } = await params;
    const response = await restoreUser(id);

    return successResponse("User restored successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to restore user", 500, error);
  }
}
