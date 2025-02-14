import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/server/auth/service";
import { errorResponse } from "./apiResponse";
import { HttpStatus } from "@/types/httpStatus.enum";
import { COOKIE_ACCESS_TOKEN } from "@/constant";
import type { JwtPayload } from "./jwt";

type RouteParams = Record<string, string>;

type Handler<T extends RouteParams = RouteParams> = (
  request: NextRequest,
  jwtPayload: JwtPayload,
  params: T,
) => Promise<NextResponse>;

export function withAuth<T extends RouteParams = RouteParams>(
  handler: Handler<T>,
): (request: NextRequest, context: { params: T }) => Promise<NextResponse> {
  return async function (request: NextRequest, context: { params: T }) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS_TOKEN);

    if (!accessToken) {
      return errorResponse("No access token found", HttpStatus.UNAUTHORIZED);
    }

    try {
      const verify = await verifyAccessToken(accessToken.value);
      return handler(request, verify, context.params);
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
