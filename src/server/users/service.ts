import { and, desc, eq, isNull, ne } from "drizzle-orm";
import { db } from "../db";
import type { IdDTO } from "../type";
import type {
  CreateUserRequestDTO,
  GetUsersResponseDTO,
  GetUserResponseDTO,
  UpdatePasswordRequestDTO,
  UpdateUserRequestDTO,
  GetUserOptionResponseDTO,
} from "./type";
import { users } from "../db/schema";
import { ClientError } from "@/utils/error";
import { HttpStatus } from "@/types/httpStatus.enum";
import { comparePassword, hashPassword } from "@/utils/bcrypt";

export async function getUser(data: IdDTO): Promise<GetUserResponseDTO> {
  const { id } = data;

  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
  });

  if (!result) {
    throw new ClientError("User not found", HttpStatus.NOT_FOUND);
  }

  return result;
}

export async function countUsers(): Promise<number> {
  return await db.$count(users, isNull(users.deletedAt));
}

export async function getUserOptions(): Promise<GetUserOptionResponseDTO[]> {
  const result = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
    },
    where: and(isNull(users.deletedAt), eq(users.role, "team")),
    orderBy: desc(users.createdAt),
  });

  return result;
}

export async function getUsers(): Promise<GetUsersResponseDTO> {
  const result = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
    orderBy: desc(users.createdAt),
  });

  return result;
}

export async function createUser(data: CreateUserRequestDTO): Promise<IdDTO> {
  const { password, ...rest } = data;
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      ...rest,
      password: passwordHash,
    })
    .returning({
      id: users.id,
    });

  if (!user) {
    throw new ClientError(
      "Failed to create user",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return { id: user.id };
}

export async function updateUser(data: UpdateUserRequestDTO, id: string) {
  if (data.username) {
    const check = await db.query.users.findFirst({
      where: and(eq(users.username, data.username), ne(users.id, id)),
    });

    if (check) {
      throw new ClientError("Username already exists", HttpStatus.BAD_REQUEST);
    }
  } else {
    delete data.username;
  }

  if (!data.name) {
    delete data.name;
  }

  if (!data.role) {
    delete data.role;
  }

  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({
      id: users.id,
    });

  if (!user) {
    throw new ClientError(
      "Failed to update user",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export async function updatePassword(
  data: UpdatePasswordRequestDTO,
  id: string,
) {
  const { oldPassword, newPassword } = data;

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    throw new ClientError("User not found", HttpStatus.NOT_FOUND);
  }

  const check = await comparePassword(oldPassword, user.password);
  if (!check) {
    throw new ClientError("Invalid old password", HttpStatus.BAD_REQUEST);
  }

  const passwordHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ password: passwordHash })
    .where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id));
}

export async function restoreUser(id: string) {
  await db.update(users).set({ deletedAt: null }).where(eq(users.id, id));
}
