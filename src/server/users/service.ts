import { eq, isNull } from "drizzle-orm";
import { db } from "../db";
import type { IdDTO } from "../type";
import type { ProfileResponseDTO } from "./type";
import { users } from "../db/schema";
import { ClientError } from "@/utils/error";
import { HttpStatus } from "@/types/httpStatus.enum";

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
