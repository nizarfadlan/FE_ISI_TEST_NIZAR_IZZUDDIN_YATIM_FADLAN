import { createTask, getTasks } from "@/server/tasks/service";
import { createTaskRequestSchema } from "@/server/tasks/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { requireAuth } from "@/utils/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const { userId } = user;
    const response = await getTasks(userId);

    return successResponse("Tasks fetched successfully", response);
  } catch (error) {
    return errorResponse(
      "Failed to fetch tasks",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const validation = await validateRequest(request, createTaskRequestSchema);
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { userId, role } = user;
    if (role !== "lead") {
      throw new ClientError(
        "You are not authorized to create task",
        HttpStatus.FORBIDDEN,
      );
    }

    const { data } = validation;
    const response = await createTask(data, userId);

    return successResponse("Task created successfully", response);
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
      "Failed to create task",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
