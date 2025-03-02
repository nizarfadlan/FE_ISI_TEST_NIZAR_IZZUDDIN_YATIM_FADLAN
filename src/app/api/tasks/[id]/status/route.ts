import { updateStatusTask } from "@/server/tasks/service";
import { updateStatusTaskRequestSchema } from "@/server/tasks/type";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { requireAuth } from "@/utils/auth";
import { NextResponse, type NextRequest } from "next/server";
import { HttpStatus } from "@/types/httpStatus.enum";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const validation = await validateRequest(
    request,
    updateStatusTaskRequestSchema,
  );
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { data } = validation;
    const { id } = await params;

    await updateStatusTask(data, id, user.userId);
    return successResponse("Task updated successfully");
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
      "Failed to update task",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
