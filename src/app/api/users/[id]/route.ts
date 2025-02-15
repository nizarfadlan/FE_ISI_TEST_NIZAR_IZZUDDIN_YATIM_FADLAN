import { deleteUser, getUser, updateUser } from "@/server/users/service";
import { updateUserRequestSchema } from "@/server/users/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { validateRequest } from "@/utils/validation";
import { requireAuth } from "@/utils/auth";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to get user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { id } = await params;
    const response = await getUser({ id });

    return successResponse("User retrieved successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to retrieve user", 500, error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const validation = await validateRequest(request, updateUserRequestSchema);
  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to update user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { data } = validation;
    const { id } = await params;
    const response = await updateUser(data, id);

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

    return errorResponse("Failed to update user", 500, error);
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    if (user.role !== "lead") {
      throw new ClientError(
        "You are not authorized to delete user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { id } = await params;
    const response = await deleteUser(id);

    return successResponse("User deleted successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to delete user", 500, error);
  }
}
