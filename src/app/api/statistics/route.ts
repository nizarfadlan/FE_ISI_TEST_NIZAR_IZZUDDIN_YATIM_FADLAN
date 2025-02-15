import { countTasks, countTasksByStatus } from "@/server/tasks/service";
import { countUsers } from "@/server/users/service";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { requireAuth } from "@/utils/auth";
import { ClientError } from "@/utils/error";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const [users, tasks, taskCompleted, taskRejected] = await Promise.all([
      countUsers(),
      countTasks(),
      countTasksByStatus("done"),
      countTasksByStatus("reject"),
    ]);

    const statistic = {
      users,
      tasks,
      taskCompleted,
      taskRejected,
    };
    return successResponse("Statistic fetched successfully", statistic);
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
      "Failed to fetch statistic",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
