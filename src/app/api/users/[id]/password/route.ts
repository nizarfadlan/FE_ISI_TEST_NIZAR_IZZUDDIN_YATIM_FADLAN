import { updatePassword } from "@/server/users/service";
import { updatePasswordRequestSchema } from "@/server/users/type";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import type { JwtPayload } from "@/utils/jwt";
import { validateRequest } from "@/utils/validation";
import { withAuth } from "@/utils/withAuth";
import { NextResponse, type NextRequest } from "next/server";

async function handlerUpdatePassword(
  req: NextRequest,
  jwtPayload: JwtPayload,
  params: { id: string },
) {
  const validation = await validateRequest(req, updatePasswordRequestSchema);

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
    const response = await updatePassword(data, id);

    return successResponse("Password updated successfully", response);
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message,
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("Failed to update password", 500, error);
  }
}
export const PATCH = withAuth(handlerUpdatePassword);
