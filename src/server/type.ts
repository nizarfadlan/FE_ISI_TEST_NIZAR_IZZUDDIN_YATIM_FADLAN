import { z } from "zod";

export const idSchema = z.object({
  id: z.string(),
});
export type IdDTO = z.infer<typeof idSchema>;

export const statisticsSchema = z.object({
  users: z.number(),
  tasks: z.number(),
  taskCompleted: z.number(),
  taskRejected: z.number(),
});
export type StatisticsDTO = z.infer<typeof statisticsSchema>;
