import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/server/auth/service";
import { errorResponse } from "./apiResponse";
import { HttpStatus } from "@/types/httpStatus.enum";
import { COOKIE_ACCESS_TOKEN } from "@/constant";
import type { JwtPayload } from "./jwt";

type Handler = (
  request: NextRequest,
  jwtPayload: JwtPayload,
) => Promise<NextResponse>;

export function withAuth(handler: Handler): Handler {
  return async function (request: NextRequest) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN);

    if (!accessToken) {
      return errorResponse("No access token found", HttpStatus.UNAUTHORIZED);
    }

    try {
      const verify = await verifyAccessToken(accessToken.value);
      return handler(request, verify);
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(error.message, HttpStatus.UNAUTHORIZED);
      }

      return errorResponse(
        "An error occurred while verifying the access token",
        500,
        error,
      );
    }
  };
}
