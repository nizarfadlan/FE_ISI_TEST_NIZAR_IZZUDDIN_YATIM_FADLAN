import { createTask, getTasks } from "@/server/tasks/service";
import { createTaskRequestSchema } from "@/server/tasks/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { validateRequest } from "@/utils/validation";
import { withAuth } from "@/utils/withAuth";
import { NextResponse, type NextRequest } from "next/server";

async function handlerList() {
  try {
    const response = await getTasks();

    return successResponse("Tasks fetched successfully", response);
  } catch (error) {
    return errorResponse("Failed to fetch tasks", 500, error);
  }
}
export const GET = withAuth(handlerList);

async function handlerCreate(req: NextRequest, jwtPayload: JwtPayload) {
  const validation = await validateRequest(req, createTaskRequestSchema);

  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { userId, role } = jwtPayload;
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

    return errorResponse("Failed to create task", 500, error);
  }
}
export const POST = withAuth(handlerCreate);
