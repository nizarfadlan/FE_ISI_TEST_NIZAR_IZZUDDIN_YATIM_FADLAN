import type { z, ZodSchema } from "zod";
import { errorResponse } from "./apiResponse";
import type { NextResponse } from "next/server";
import type { ErrorResponse } from "@/types";

export async function validateRequest<T extends ZodSchema>(
  req: Request,
  schema: T,
): Promise<{ data: z.infer<T> } | NextResponse<ErrorResponse>> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return errorResponse("Validation failed", 422, formattedErrors);
    }

    return { data: result.data };
  } catch (error) {
    if (error instanceof Error && error.message.includes("JSON")) {
      return errorResponse("Invalid JSON in request body", 400);
    }

    return errorResponse("Internal server error during validation", 500, error);
  }
}
