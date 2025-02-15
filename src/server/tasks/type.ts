import { z } from "zod";
import {
  taskInsertSchema,
  taskSelectSchema,
  taskUpdateSchema,
} from "../db/schema";

const getTaskSchema = taskSelectSchema
  .pick({
    id: true,
    title: true,
    description: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    createdById: true,
  })
  .extend({
    createdBy: z.string(),
    assigneeIds: z.array(z.string().uuid()),
  });
export type GetTaskDTO = z.infer<typeof getTaskSchema>;

export const getTasksResponseSchema = z.array(getTaskSchema);
export type GetTasksResponseDTO = z.infer<typeof getTasksResponseSchema>;

export const createTaskRequestSchema = taskInsertSchema
  .omit({
    id: true,
    createdById: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    assigneeIds: z.array(z.string().uuid()).optional(),
  });
export type CreateTaskRequestDTO = z.infer<typeof createTaskRequestSchema>;

export const updateStatusTaskRequestSchema = taskUpdateSchema.pick({
  status: true,
});
export type UpdateStatusTaskRequestDTO = z.infer<
  typeof updateStatusTaskRequestSchema
>;

export const updateTaskRequestSchema = taskUpdateSchema
  .omit({
    id: true,
    createdById: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    assigneeIds: z.array(z.string().uuid()).optional(),
  });
export type UpdateTaskRequestDTO = z.infer<typeof updateTaskRequestSchema>;
