import { db } from "@/server/db";
import { taskLogs, type InsertTaskLog } from "@/server/db/schema";
import { desc, lte } from "drizzle-orm";
import type { GetTaskLogsRequestDTO, GetTaskLogsResponseDTO } from "./type";
import { decodeCursor, encodeCursor } from "@/utils";

export async function createTaskLog(log: InsertTaskLog) {
  await db.insert(taskLogs).values(log);
}

export async function getTaskLogs(
  params: GetTaskLogsRequestDTO,
): Promise<GetTaskLogsResponseDTO> {
  const cursor = params.cursor ? decodeCursor(params.cursor) : undefined;
  const limit = params.limit ?? 10;

  const query = await db.query.taskLogs.findMany({
    orderBy: desc(taskLogs.timestamp),
    with: {
      user: {
        columns: {
          name: true,
        },
      },
    },
    limit: limit + 1,
    where: cursor ? lte(taskLogs.id, cursor) : undefined,
  });

  const nextCursor =
    query.length > limit
      ? encodeCursor(query.pop()?.id.toString() ?? "")
      : null;

  return {
    logs: query,
    nextCursor,
  };
}
