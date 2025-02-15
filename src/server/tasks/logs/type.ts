import { taskLogSelectSchema } from "@/server/db/schema";
import { z } from "zod";

export const getTaskLogsRequestSchema = z.object({
  cursor: z.string().nullable().optional(),
  limit: z.number().int().positive().default(10).nullable().optional(),
});
export type GetTaskLogsRequestDTO = z.infer<typeof getTaskLogsRequestSchema>;

const getTagLog = taskLogSelectSchema.extend({
  user: z.object({
    name: z.string(),
  }),
});

export const getTaskLogsResponseSchema = z.object({
  logs: z.array(getTagLog),
  nextCursor: z.string().nullable().optional(),
});
export type GetTaskLogsResponseDTO = z.infer<typeof getTaskLogsResponseSchema>;
