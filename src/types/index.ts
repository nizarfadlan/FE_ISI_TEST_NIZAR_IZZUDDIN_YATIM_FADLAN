import type { Role } from "@/server/db/schema";
import type { LucideProps } from "lucide-react";
import type dynamicIconImports from "lucide-react/dynamicIconImports";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

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
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  roles?: Role[];
};
