import type { z } from "zod";
import { taskInsertSchema, taskUpdateSchema } from "../db/schema";

export const createTaskRequestSchema = taskInsertSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateTaskRequestDTO = z.infer<typeof createTaskRequestSchema>;

export const updateTaskRequestSchema = taskUpdateSchema.omit({
  id: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type UpdateTaskRequestDTO = z.infer<typeof updateTaskRequestSchema>;
