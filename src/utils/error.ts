import type { ErrorResponse } from "@/types";

/**
 * Custom error class for client errors.
 *
 * @class ClientError
 * @extends {Error}
 * @param {string} message - Error message.
 * @param {number} status - HTTP status code.
 * @param {unknown} [details] - Optional error details.
 * @returns {ClientError}
 * @example
 *
 * throw new ClientError("Not found", 404);
 */
export class ClientError extends Error {
  public success: false;
  public error: {
    message: string;
    status: number;
    details?: unknown;
    stack?: string;
  };

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.success = false;
    this.error = {
      message,
      status,
      details,
    };

    if (process.env.NODE_ENV === "development") {
      this.error.stack = this.stack;
    }
  }

  toJson(): ErrorResponse {
    return {
      success: this.success,
      error: this.error,
    };
  }
}
