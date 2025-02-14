import { countTasks, countTasksByStatus } from "@/server/tasks/service";
import { countUsers } from "@/server/users/service";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { withAuth } from "@/utils/withAuth";

async function handler() {
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

    return errorResponse("Failed to fetch statistic", 500, error);
  }
}

export const GET = withAuth(handler);
