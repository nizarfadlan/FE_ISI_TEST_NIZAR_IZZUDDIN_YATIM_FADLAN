import { db } from "@/server/db";
import { taskLogs, type InsertTaskLog } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function createTaskLog(log: InsertTaskLog) {
  await db.insert(taskLogs).values(log);
}

export async function getTaskLogs(taskId: string) {
  return await db.query.taskLogs.findMany({
    where: eq(taskLogs.taskId, taskId),
    orderBy: desc(taskLogs.timestamp),
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
  });
}
