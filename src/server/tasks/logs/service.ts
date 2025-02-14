import { db } from "@/server/db";
import { taskLogs, type InsertTaskLog } from "@/server/db/schema";

export async function createTaskLog(log: InsertTaskLog) {
  await db.insert(taskLogs).values(log);
}
