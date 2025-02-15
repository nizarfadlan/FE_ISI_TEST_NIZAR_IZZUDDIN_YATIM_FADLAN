import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "../db";
import { taskAssignees, tasks, type TaskStatus } from "../db/schema";
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

export async function getTasks(userId: string): Promise<GetTasksResponseDTO> {
  const assignedTasks = await db.query.taskAssignees.findMany({
    where: eq(taskAssignees.userId, userId),
    columns: {
      taskId: true,
    },
  });

  const taskIds = assignedTasks.map((task) => task.taskId);
  const result = await db.query.tasks.findMany({
    where: and(
      isNull(tasks.deletedAt),
      or(eq(tasks.createdById, userId), inArray(tasks.id, taskIds)),
    ),
    columns: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      createdById: true,
    },
    with: {
      createdBy: {
        columns: {
          name: true,
        },
      },
      assignees: {
        columns: {
          userId: true,
        },
      },
    },
    orderBy: desc(tasks.createdAt),
  });

  return result.map((task) => ({
    ...task,
    createdBy: task.createdBy.name,
    assigneeIds: task.assignees.map((assignee) => assignee.userId),
  }));
}

export async function createTask(
  data: CreateTaskRequestDTO,
  userId: string,
): Promise<IdDTO> {
  const { assigneeIds, ...dataTask } = data;
  const [task] = await db
    .insert(tasks)
    .values({
      ...dataTask,
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

  await Promise.all([
    createTaskLog({
      ...data,
      taskId: task.id,
      userId,
      action: "create",
    }),
    assigneeIds && assigneeIds.length > 0
      ? db.insert(taskAssignees).values(
          assigneeIds.map((id) => ({
            userId: id,
            taskId: task.id,
          })),
        )
      : Promise.resolve(),
  ]);

  return { id: task.id };
}

export async function updateTask(
  data: UpdateTaskRequestDTO,
  taskId: string,
  jwtPayload: JwtPayload,
): Promise<void> {
  const { userId, role } = jwtPayload;
  const { assigneeIds, ...dataTask } = data;

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, taskId), isNull(tasks.deletedAt)),
  });

  if (!task) {
    throw new ClientError("Task not found", HttpStatus.NOT_FOUND);
  }

  const isLeader = role === "lead";
  const isOwner = task.createdById === userId;

  if (!isLeader) {
    delete dataTask.title;
  }
  if (!dataTask.title) {
    delete dataTask.title;
  }
  if (!dataTask.status) {
    delete dataTask.status;
  }

  if (Object.keys(dataTask).length > 0) {
    await db.update(tasks).set(dataTask).where(eq(tasks.id, taskId));
  }

  await createTaskLog({
    ...dataTask,
    taskId,
    userId,
    action: "update",
  });

  if (isOwner && assigneeIds) {
    const assignees = await db.query.taskAssignees.findMany({
      where: eq(taskAssignees.taskId, taskId),
      columns: {
        userId: true,
      },
    });

    const existingAssigneeIds = new Set(
      assignees.map((t) => t.userId).filter(Boolean),
    );

    const newAssigneeIds = new Set(assigneeIds);

    const usersToAdd = [...newAssigneeIds].filter(
      (id) => !existingAssigneeIds.has(id),
    );
    const usersToRemove = [...existingAssigneeIds].filter(
      (id) => !newAssigneeIds.has(id),
    );

    if (usersToAdd.length > 0) {
      await db
        .insert(taskAssignees)
        .values(usersToAdd.map((id) => ({ userId: id, taskId })));
    }
    if (usersToRemove.length > 0) {
      await db
        .delete(taskAssignees)
        .where(
          and(
            eq(taskAssignees.taskId, taskId),
            inArray(taskAssignees.userId, usersToRemove),
          ),
        );
    }
  }
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
