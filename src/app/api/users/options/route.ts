import { getUserOptions } from "@/server/users/service";
import { HttpStatus } from "@/types/httpStatus.enum";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { requireAuth } from "@/utils/auth";
import { ClientError } from "@/utils/error";
import { NextResponse } from "next/server";

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
    const response = await getUserOptions();

    return successResponse("User options fetched successfully", response);
  } catch (error) {
    return errorResponse("Failed to fetch user options", 500, error);
  }
}
