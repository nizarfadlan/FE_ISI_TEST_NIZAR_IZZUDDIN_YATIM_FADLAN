"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useSidebar } from "@/hooks/useSidebar";
import type { RoutesDashboard } from "@/types";
import { cn } from "@/utils";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

export default function SidebarLinks({
  routes,
}: {
  routes: RoutesDashboard[];
}) {
  const pathname = usePathname();
  const { loading, user } = useAuthStore();
  const { isCollapsed } = useSidebar();

  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const createLinks = (routes: RoutesDashboard[]) => {
    return routes.map((route, index) => {
      if (!loading.auth && route.roles && !user?.role) return null;

      if (
        !loading.auth &&
        route.roles &&
        user?.role &&
        !route.roles.includes(user.role)
      )
        return null;

      return (
        <Link key={index} href={route.pathName}>
          <div className="group relative mb-4 flex w-full flex-row items-center text-sm hover:cursor-pointer">
            <li
              className="my-[3px] flex cursor-pointer items-center px-8"
              key={index}
            >
              <span
                className={cn(
                  activeRoute(route.pathName) === true
                    ? "font-medium text-indigo-600"
                    : "text-gray-600 group-hover:text-indigo-600",
                )}
              >
                {route.icon ? (
                  <route.icon className="h-5 w-5" />
                ) : (
                  <LayoutDashboardIcon className="h-5 w-5" />
                )}{" "}
              </span>
              <p
                className={cn(
                  "leading-1 ml-4 flex lg:hidden",
                  activeRoute(route.pathName) === true
                    ? "font-medium text-indigo-600"
                    : "text-gray-600 group-hover:text-indigo-600",
                  { "lg:block": !isCollapsed },
                )}
              >
                {route.name}
              </p>
            </li>
            {activeRoute(route.pathName) ? (
              <div className="absolute bottom-auto left-2 top-auto h-9 w-1 rounded-lg bg-indigo-600" />
            ) : null}
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      {!loading.auth ? (
        <div>{createLinks(routes)}</div>
      ) : (
        <div className="group relative mb-4 flex w-full flex-row items-center text-sm hover:cursor-pointer">
          <li className="my-[3px] flex cursor-pointer items-center px-8">
            <span className="group-hover:text-primary font-medium text-gray-600">
              <LayoutDashboardIcon className="h-5 w-5" />
            </span>
            <p
              className={cn(
                "leading-1 group-hover:text-primary ml-4 flex font-medium text-gray-600 lg:hidden",
                { "lg:block": !isCollapsed },
              )}
            >
              Loading
            </p>
          </li>
        </div>
      )}
    </>
  );
}
