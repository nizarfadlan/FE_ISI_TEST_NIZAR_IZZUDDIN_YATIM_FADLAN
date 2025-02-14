"use client";

import {
  CheckSquare,
  Home,
  LogOut,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  Users,
  XIcon,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { RoutesDashboard } from "@/types";
import { useSidebar } from "@/hooks/useSidebar";
import { useRef } from "react";
import { useOutSideClick } from "@/hooks/useOutSideClick";
import { cn } from "@/utils";
import SidebarLinks from "./links";
import { Button } from "../../button";

const navigation: RoutesDashboard[] = [
  { name: "Dashboard", pathName: "/dashboard", icon: Home },
  { name: "Todo List", pathName: "/dashboard/todos", icon: CheckSquare },
  {
    name: "Users",
    pathName: "/dashboard/users",
    icon: Users,
    roles: ["lead"],
  },
];

export default function Sidebar() {
  const { logout } = useAuthStore();
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();
  const wrapperRef = useRef(null);
  useOutSideClick(wrapperRef, () => toggleSidebar(false));

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white transition-all duration-300 ease-in-out",
        "flex flex-col shadow-lg",
        "w-64",
        "lg:translate-x-0",
        { "w-64 -translate-x-96": !isCollapsed },
        { "w-64 translate-x-0 lg:w-0": isCollapsed },
      )}
    >
      <div
        className={cn(
          "mt-8 flex px-4 lg:px-6",
          "flex-row-reverse items-center justify-between space-x-3",
          {
            "lg:flex-col lg:items-center lg:justify-normal lg:space-x-0 lg:space-y-4":
              isCollapsed,
          },
          {
            "lg:flex-row-reverse lg:items-center lg:justify-between lg:space-x-3":
              !isCollapsed,
          },
        )}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={() => toggleSidebar(!isCollapsed)}
          className={cn(
            "flex items-center justify-center rounded-full hover:bg-gray-100 [&_svg]:size-5",
            isCollapsed && !isMobile && "ml-4 bg-white p-2 shadow-lg",
          )}
        >
          {isMobile ? (
            <XIcon />
          ) : isCollapsed ? (
            <PanelLeftOpenIcon />
          ) : (
            <PanelLeftCloseIcon />
          )}
        </Button>

        <div className="flex flex-row items-center space-x-3">
          <h3
            className={cn(
              "block font-semibold",
              isCollapsed ? "lg:hidden" : "lg:block",
            )}
          >
            TeamTodo
          </h3>
        </div>
      </div>
      <ul className="sidebar-links mb-auto mt-6 flex h-full w-full flex-col justify-between overflow-y-auto overflow-x-clip px-6 pt-1">
        <SidebarLinks routes={navigation} />
        <div className="mt-auto flex flex-shrink-0 border-t border-gray-200">
          <Button
            onClick={logout}
            variant="ghost"
            className="mt-2 flex w-full justify-start hover:text-indigo-600"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </ul>
    </div>
  );
}
