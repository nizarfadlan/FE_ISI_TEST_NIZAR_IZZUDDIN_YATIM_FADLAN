import type { IdDTO } from "@/server/type";
import { deleteUser, updateUser } from "@/server/users/service";
import { updateUserRequestSchema } from "@/server/users/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { validateRequest } from "@/utils/validation";
import { withAuth } from "@/utils/withAuth";
import { NextResponse, type NextRequest } from "next/server";

async function handlerUpdate(
  req: NextRequest,
  jwtPayload: JwtPayload,
  params: IdDTO,
) {
  const validation = await validateRequest(req, updateUserRequestSchema);

  if (validation instanceof NextResponse) {
    return validation;
  }

  try {
    if (jwtPayload.role !== "lead") {
      throw new ClientError(
        "You are not authorized to update user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { data } = validation;
    const { id } = params;
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
export const PATCH = withAuth(handlerUpdate);

async function handlerDelete(
  _: NextRequest,
  jwtPayload: JwtPayload,
  params: IdDTO,
) {
  try {
    if (jwtPayload.role !== "lead") {
      throw new ClientError(
        "You are not authorized to delete user",
        HttpStatus.FORBIDDEN,
      );
    }

    const { id } = params;
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
export const DELETE = withAuth(handlerDelete);
