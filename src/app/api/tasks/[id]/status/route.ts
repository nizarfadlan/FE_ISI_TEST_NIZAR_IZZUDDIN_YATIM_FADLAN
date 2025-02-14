import { updateStatusTask } from "@/server/tasks/service";
import { updateStatusTaskRequestSchema } from "@/server/tasks/type";
import type { IdDTO } from "@/server/type";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { validateRequest } from "@/utils/validation";
import { withAuth } from "@/utils/withAuth";
import { NextResponse, type NextRequest } from "next/server";

async function handlerUpdateStatus(
  req: NextRequest,
  jwtPayload: JwtPayload,
  params: IdDTO,
) {
  const validation = await validateRequest(req, updateStatusTaskRequestSchema);

  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { data } = validation;
    const { id } = params;
    const response = await updateStatusTask(data, id, jwtPayload.userId);

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
export const PATCH = withAuth(handlerUpdateStatus);
