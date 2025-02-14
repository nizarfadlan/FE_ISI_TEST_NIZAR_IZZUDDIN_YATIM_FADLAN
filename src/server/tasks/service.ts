import { eq } from "drizzle-orm";
import { db } from "../db";
import { tasks, type TaskStatus } from "../db/schema";

export async function countTasks(): Promise<number> {
  return await db.$count(tasks);
}

export async function countTasksByStatus(status: TaskStatus): Promise<number> {
  return await db.$count(tasks, eq(tasks.status, status));
}
