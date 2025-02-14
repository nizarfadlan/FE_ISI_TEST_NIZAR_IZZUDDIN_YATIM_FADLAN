import { deleteTask, updateTask } from "@/server/tasks/service";
import { updateTaskRequestSchema } from "@/server/tasks/type";
import type { IdDTO } from "@/server/type";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { validateRequest } from "@/utils/validation";
import { withAuth } from "@/utils/withAuth";
import { NextResponse, type NextRequest } from "next/server";

async function handlerUpdate(
  req: NextRequest,
  jwtPayload: JwtPayload,
  params: IdDTO,
) {
  const validation = await validateRequest(req, updateTaskRequestSchema);

  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { data } = validation;
    const { id } = params;
    const response = await updateTask(data, id, jwtPayload);

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
export const PUT = withAuth(handlerUpdate);

async function handlerDelete(
  _: NextRequest,
  jwtPayload: JwtPayload,
  params: IdDTO,
) {
  try {
    await deleteTask(params, jwtPayload.userId);

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
export const DELETE = withAuth(handlerDelete);
