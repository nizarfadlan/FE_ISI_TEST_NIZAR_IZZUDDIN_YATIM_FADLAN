import { getTaskLogs } from "@/server/tasks/logs/service";
import { getTaskLogsRequestSchema } from "@/server/tasks/logs/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { requireAuth } from "@/utils/auth";
import { ClientError } from "@/utils/error";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const { role } = user;
    if (role !== "lead") {
      throw new ClientError(
        "You are not authorized to fetch task logs",
        HttpStatus.FORBIDDEN,
      );
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");

    const validation = getTaskLogsRequestSchema.safeParse({
      cursor,
      limit,
    });

    if (!validation.success) {
      const formattedErrors = validation.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return errorResponse(
        "Validation failed",
        HttpStatus.UNPROCESSABLE_ENTITY,
        formattedErrors,
      );
    }

    const response = await getTaskLogs(validation.data);

    return successResponse("Task logs fetched successfully", response);
  } catch (error) {
    return errorResponse(
      "Failed to fetch task logs",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
