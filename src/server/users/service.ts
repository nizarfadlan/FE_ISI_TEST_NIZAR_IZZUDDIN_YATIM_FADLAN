import { eq, isNull } from "drizzle-orm";
import { db } from "../db";
import type { IdDTO } from "../type";
import type {
  CreateUserRequestDTO,
  GetUsersResponseDTO,
  ProfileResponseDTO,
  UpdatePasswordRequestDTO,
  UpdateUserRequestDTO,
} from "./type";
import { users } from "../db/schema";
import { ClientError } from "@/utils/error";
import { HttpStatus } from "@/types/httpStatus.enum";
import { comparePassword } from "@/utils/bcrypt";

export async function getProfile(data: IdDTO): Promise<ProfileResponseDTO> {
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

export async function getUsers(): Promise<GetUsersResponseDTO> {
  const result = await db.query.users.findMany({
    where: isNull(users.deletedAt),
  });

  return result;
}

export async function createUser(data: CreateUserRequestDTO): Promise<IdDTO> {
  const [user] = await db.insert(users).values(data).returning({
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

  await db.update(users).set({ password: newPassword }).where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id));
}
