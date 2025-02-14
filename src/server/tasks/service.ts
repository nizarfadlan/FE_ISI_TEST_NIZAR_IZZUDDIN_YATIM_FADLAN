import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { tasks, type TaskStatus } from "../db/schema";
import type {
  CreateTaskRequestDTO,
  GetTasksResponseDTO,
  UpdateStatusTaskRequestDTO,
  UpdateTaskRequestDTO,
} from "./type";
import type { IdDTO } from "../type";
import { createTaskLog } from "./logs/service";
import { ClientError } from "@/utils/error";
import { HttpStatus } from "@/types/httpStatus.enum";
import type { JwtPayload } from "@/utils/jwt";

export async function countTasks(): Promise<number> {
  return await db.$count(tasks, isNull(tasks.deletedAt));
}

export async function countTasksByStatus(status: TaskStatus): Promise<number> {
  return await db.$count(
    tasks,
    and(eq(tasks.status, status), isNull(tasks.deletedAt)),
  );
}

export async function getTasks(): Promise<GetTasksResponseDTO> {
  const result = await db.query.tasks.findMany({
    where: isNull(tasks.deletedAt),
    columns: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    with: {
      createdBy: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: desc(tasks.createdAt),
  });

  return result.map((task) => ({
    ...task,
    createdBy: task.createdBy.name,
  }));
}

export async function createTask(
  data: CreateTaskRequestDTO,
  userId: string,
): Promise<IdDTO> {
  const [task] = await db
    .insert(tasks)
    .values({
      ...data,
      createdById: userId,
    })
    .returning({
      id: tasks.id,
    });

  if (!task) {
    throw new ClientError(
      "Failed to create task",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  await createTaskLog({
    ...data,
    taskId: task.id,
    userId,
    action: "create",
  });

  return { id: task.id };
}

export async function updateTask(
  data: UpdateTaskRequestDTO,
  taskId: string,
  jwtPayload: JwtPayload,
): Promise<void> {
  const { userId, role } = jwtPayload;

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), isNull(tasks.deletedAt)),
  });

  if (!task) {
    throw new ClientError("Task not found", HttpStatus.NOT_FOUND);
  }

  const isLeader = role === "lead";

  if (!isLeader) {
    delete data.title;
  }
  if (!data.title) {
    delete data.title;
  }
  if (!data.status) {
    delete data.status;
  }

  await Promise.all([
    db.update(tasks).set(data).where(eq(tasks.id, taskId)),
    createTaskLog({
      ...data,
      taskId: taskId,
      userId,
      action: "update",
    }),
  ]);
}

export async function updateStatusTask(
  data: UpdateStatusTaskRequestDTO,
  taskId: string,
  userId: string,
): Promise<void> {
  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), isNull(tasks.deletedAt)),
  });

  if (!task) {
    throw new ClientError("Task not found", HttpStatus.NOT_FOUND);
  }

  await Promise.all([
    db.update(tasks).set(data).where(eq(tasks.id, taskId)),
    createTaskLog({
      ...data,
      taskId: taskId,
      userId,
      action: "update",
    }),
  ]);
}

export async function deleteTask(data: IdDTO, userId: string): Promise<void> {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, data.id),
  });

  if (!task) {
    throw new ClientError("Task not found", HttpStatus.NOT_FOUND);
  }

  if (task.createdById !== userId) {
    throw new ClientError(
      "You are not authorized to delete this task",
      HttpStatus.FORBIDDEN,
    );
  }

  await Promise.all([
    db
      .update(tasks)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(tasks.id, data.id)),
    createTaskLog({
      taskId: data.id,
      userId: task.createdById,
      action: "delete",
    }),
  ]);
}
