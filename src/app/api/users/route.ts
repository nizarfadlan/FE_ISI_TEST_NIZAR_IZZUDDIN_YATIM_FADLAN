import { createUser, getUsers, updateUser } from "@/server/users/service";
import {
  createUserRequestSchema,
  updateUserMeRequestSchema,
} from "@/server/users/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { requireAuth } from "@/utils/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to create user",
        HttpStatus.FORBIDDEN,
      );
    }
    const response = await getUsers();

    return successResponse("Users fetched successfully", response);
  } catch (error) {
    return errorResponse(
      "Failed to fetch users",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const validation = await validateRequest(request, createUserRequestSchema);
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to create user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { data } = validation;
    const response = await createUser(data);

    return successResponse("User created successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse(
      "Failed to create user",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}

export async function PATCH(request: NextRequest) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const validation = await validateRequest(request, updateUserMeRequestSchema);
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    const { userId } = user;
    const { data } = validation;
    const response = await updateUser(data, userId);

    return successResponse("User updated successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse(
      "Failed to update user",
      HttpStatus.INTERNAL_SERVER_ERROR,
      error,
    );
  }
}
