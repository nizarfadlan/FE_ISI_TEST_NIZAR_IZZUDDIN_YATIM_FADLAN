import { errorResponse, successResponse } from "@/utils/apiResponse";
import { ClientError } from "@/utils/error";
import { hasAccessToken } from "@/server/auth/service";

export async function GET() {
  try {
    const hasToken = await hasAccessToken();
    return successResponse(
      hasToken ? "User is authenticated" : "User is not authenticated",
      { isAuthenticated: hasToken },
    );
  } catch (error) {
    if (error instanceof ClientError) {
      const { error: errorClient } = error.toJson();
      return errorResponse(
        errorClient.message || "Authentication check failed",
        errorClient.status,
        errorClient.details,
      );
    }

    return errorResponse("An error occurred while status", 500, error);
  }
}
