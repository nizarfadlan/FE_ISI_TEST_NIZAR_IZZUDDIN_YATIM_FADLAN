"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import type { RoutesDashboard } from "@/types";
import { cn } from "@/utils";
import { LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

export const SidebarLinks = ({
  routes,
}: {
  routes: RoutesDashboard[];
}): JSX.Element => {
  const pathname = usePathname();
  const { loading, user } = useAuthStore();

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
          <div className="group relative mb-5 flex w-full flex-row items-center text-sm hover:cursor-pointer">
            <li
              className="my-[3px] flex cursor-pointer items-center px-4"
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
                  "leading-1 ml-4 flex",
                  activeRoute(route.pathName) === true
                    ? "font-medium text-indigo-600"
                    : "text-gray-600 group-hover:text-indigo-600",
                )}
              >
                {route.name}
              </p>
            </li>
            {activeRoute(route.pathName) ? (
              <div className="absolute bottom-auto left-0 top-auto h-9 w-1 rounded-lg bg-indigo-600" />
            ) : null}
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      {!loading.auth ? (
        createLinks(routes)
      ) : (
        <div className="group relative mb-4 flex w-full flex-row items-center text-sm hover:cursor-pointer">
          <li className="my-[3px] flex cursor-pointer items-center px-8">
            <span className="group-hover:text-third-main font-medium text-gray-600">
              <LayoutDashboardIcon className="h-5 w-5" />
            </span>
            <p className="leading-1 group-hover:text-third-main ml-4 flex font-medium text-gray-600">
              Loading
            </p>
          </li>
        </div>
      )}
    </>
  );
};

const LinksSubmenu = ({
  route,
  pathname,
  session,
}: {
  route: RoutesDashboard;
  pathname: string;
  session: Session;
}): JSX.Element => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  const activeSubRoute = useCallback(
    (routeName: string) => {
      routeName = routeName.endsWith("/")
        ? routeName.replace(/\/$/, "")
        : routeName;
      return pathname === routeName;
    },
    [pathname],
  );

  return (
    <>
      <button
        onClick={toggleSubMenu}
        className="group relative mb-4 flex w-full flex-row items-center text-sm focus:outline-none"
      >
        <li className="my-[3px] flex cursor-pointer items-center px-8">
          <span
            className={cn(
              activeRoute(route.path) === true
                ? "text-dark font-bold"
                : "group-hover:text-third-main font-medium text-gray-600",
            )}
          >
            {route.icon ? (
              <Icon name={route.icon} className="h-5 w-5" />
            ) : (
              <LayoutDashboardIcon className="h-5 w-5" />
            )}{" "}
          </span>
          <p
            className={cn(
              "leading-1 ml-4 flex",
              activeRoute(route.path) === true
                ? "text-dark font-bold"
                : "group-hover:text-third-main font-medium text-gray-600",
            )}
          >
            {route.name}
          </p>
        </li>
        <div
          className={cn(
            "absolute bottom-auto right-0 top-auto mr-4 transform transition-all duration-300 ease-in-out",
            subMenuOpen ? "rotate-180" : "",
          )}
        >
          <Icon name="chevron-down" className="h-4 w-4" />
        </div>
        {activeRoute(route.path) ? (
          <div className="bg-third-main absolute bottom-auto left-2 top-auto h-9 w-1 rounded-lg" />
        ) : null}
      </button>

      {(subMenuOpen || activeRoute(route.path)) && (
        <div className="bg-secondary-main/5 my-2 ml-14 mr-2 rounded-xl px-2 py-4 text-sm">
          <ul className="flex flex-col space-y-4">
            {route.children?.map((subItem, index) => {
              if (subItem.rules && !subItem.rules.includes(session.user.role))
                return null;
              if (
                subItem.position &&
                session.user.structure?.position &&
                !subItem.position.includes(
                  session.user.structure?.position as PositionOrganizer,
                )
              )
                return null;
              if (
                subItem.requiredVerifiedEmail &&
                !session.user.isEmailVerified
              )
                return null;

              return (
                <Link
                  key={index}
                  href={route.layout + subItem.layout + subItem.path}
                  className={cn(
                    "leading-1 ml-4 flex",
                    activeSubRoute(
                      route.layout + subItem.layout + subItem.path,
                    ) === true
                      ? "text-dark font-bold"
                      : "hover:text-third-main font-medium text-gray-600",
                  )}
                >
                  <li className="flex items-center">
                    <span>
                      {subItem.icon && (
                        <Icon name={subItem.icon} className="h-5 w-5" />
                      )}{" "}
                    </span>
                    <p className={subItem.icon && "ml-2"}>{subItem.name}</p>
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default SidebarLinks;
