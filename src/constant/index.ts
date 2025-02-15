import type { RoutesDashboard } from "@/types";
import { CheckSquare, Home, Logs, User2, Users } from "lucide-react";

export const JWT_EXPIRATION = 10 * 60;
export const JWT_EXPIRATION_REFRESH = 7 * 24 * 60 * 60;
export const JWT_ALGORITHM = "HS256";
export const COOKIE_ACCESS_TOKEN = "auth_access_token";
export const COOKIE_REFRESH_TOKEN = "auth_refresh_token";

export const navigation: RoutesDashboard[] = [
  { name: "Dashboard", pathName: "/dashboard", icon: Home },
  { name: "Task List", pathName: "/dashboard/tasks", icon: CheckSquare },
  {
    name: "Task Logs",
    pathName: "/dashboard/tasks/logs",
    icon: Logs,
    roles: ["lead"],
  },
  {
    name: "Users",
    pathName: "/dashboard/users",
    icon: Users,
    roles: ["lead"],
  },
  {
    name: "Profile",
    pathName: "/dashboard/profile",
    icon: User2,
  },
];
