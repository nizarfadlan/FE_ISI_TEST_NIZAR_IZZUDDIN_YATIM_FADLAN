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
import { createSelectSchema } from "drizzle-zod";

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
});

export const userSelectSchema = createSelectSchema(users);

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
});

export const taskLogs = pgTable("task_logs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  taskId: uuid("task_id")
    .references(() => tasks.id)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

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
