import type { Role } from "@/server/db/schema";
import type { LucideIcon } from "lucide-react";
import type dynamicIconImports from "lucide-react/dynamicIconImports";

export interface SuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    status: number;
    details?: unknown;
    stack?: string;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type IconType = keyof typeof dynamicIconImports;

export type RoutesDashboard = {
  name: string;
  pathName: string;
  icon?: LucideIcon;
  roles?: Role[];
};
