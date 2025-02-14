"use client";

import { CheckSquare, Home, LogOut, Users, XIcon } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { RoutesDashboard } from "@/types";
import { useSidebar } from "@/hooks/useSidebar";
import { useRef } from "react";
import { useOutSideClick } from "@/hooks/useOutSideClick";
import { cn } from "@/utils";
import SidebarLinks from "./links";
import { Button } from "../button";

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
  const { toggleSidebar: open, setToggleSidebar: setOpen } = useSidebar();
  const wrapperRef = useRef(null);
  useOutSideClick(wrapperRef, () => setOpen(false));

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "sm:none duration-175 linear fixed !z-50 flex max-h-screen min-h-full w-full max-w-64 flex-col rounded-e-2xl bg-white px-4 pb-5 shadow-inherit transition-all xl:!z-0",
        open ? "translate-x-0" : "-translate-x-96 xl:translate-x-0",
      )}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={() => setOpen(false)}
      >
        <XIcon className="h-5 w-5" />
      </span>

      <div className="mt-[50px] flex items-center px-2">
        <div className="flex flex-col items-center px-6">
          <h2 className="ml-2 text-center font-semibold">TeamTodo</h2>
        </div>
      </div>

      <ul className="sidebar-links mb-auto mt-8 h-full w-full overflow-y-auto overflow-x-clip pt-1">
        <SidebarLinks routes={navigation} />
      </ul>

      <div className="flex flex-shrink-0 border-t border-gray-200 pt-4">
        <Button
          onClick={logout}
          variant="ghost"
          className="flex w-full justify-start hover:text-indigo-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
