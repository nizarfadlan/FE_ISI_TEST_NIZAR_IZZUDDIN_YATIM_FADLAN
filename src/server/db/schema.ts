// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { z } from "zod";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const roleEnum = pgEnum("role", ["lead", "team"]);
export const taskStatusEnum = pgEnum("task_status", [
  "not_started",
  "on_progress",
  "done",
  "reject",
]);

export type Role = (typeof roleEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];

export const users = pgTable("users", {
  id: uuid("id").primaryKey().$defaultFn(uuidv7),
  name: varchar("name", { length: 50 }).notNull(),
  username: varchar("username", { length: 25 }).unique().notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  taskLogs: many(taskLogs),
  refreshTokens: many(refreshToken),
}));

export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users);
export const userUpdateSchema = createUpdateSchema(users);

export type User = z.infer<typeof userSelectSchema>;

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().$defaultFn(uuidv7),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("not_started").notNull(),
  createdById: uuid("created_by_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
  }),
  taskLogs: many(taskLogs),
}));

export const taskSelectSchema = createSelectSchema(tasks);
export const taskInsertSchema = createInsertSchema(tasks);
export const taskUpdateSchema = createUpdateSchema(tasks);

export type Task = z.infer<typeof taskSelectSchema>;

export const taskLogs = pgTable("task_logs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  taskId: uuid("task_id")
    .references(() => tasks.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  status: taskStatusEnum("status"),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const taskLogsRelations = relations(taskLogs, ({ one }) => ({
  task: one(tasks, {
    fields: [taskLogs.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskLogs.userId],
    references: [users.id],
  }),
}));

export const taskLogInsertSchema = createInsertSchema(taskLogs);
export type InsertTaskLog = z.infer<typeof taskLogInsertSchema>;

export const refreshToken = pgTable("refresh_token", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  token: text("token").unique().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(users, {
    fields: [refreshToken.userId],
    references: [users.id],
  }),
}));
