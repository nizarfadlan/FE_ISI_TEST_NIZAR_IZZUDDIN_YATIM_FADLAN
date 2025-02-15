import { NextResponse } from "next/server";
import { HttpStatus } from "../types/httpStatus.enum";
import type { ErrorResponse, SuccessResponse } from "@/types";
import { ClientError } from "./error";

export function successResponse<T>(
  message?: string,
  data?: T,
  status: HttpStatus = HttpStatus.OK,
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function errorResponse(
  message: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: unknown,
): NextResponse<ErrorResponse> {
  const errorPayload: ErrorResponse = {
    success: false,
    error: { message, status },
  };

  if (
    details &&
    !(details instanceof ClientError || details instanceof Error)
  ) {
    errorPayload.error.details = details;
  }

  if (process.env.NODE_ENV === "development") {
    errorPayload.error.stack = new Error().stack;
  }

  return NextResponse.json(errorPayload, { status });
}
