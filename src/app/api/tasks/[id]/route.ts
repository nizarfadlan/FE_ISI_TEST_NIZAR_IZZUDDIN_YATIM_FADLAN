import { deleteTask, updateTask } from "@/server/tasks/service";
import { updateTaskRequestSchema } from "@/server/tasks/type";
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

  const validation = await validateRequest(request, updateTaskRequestSchema);
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { data } = validation;
    const { id } = await params;
    const response = await updateTask(data, id, user);

    return successResponse("Task updated successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to update task", 500, error);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    await deleteTask({ id }, user.userId);

    return successResponse("Task deleted successfully");
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to delete task", 500, error);
  }
}
