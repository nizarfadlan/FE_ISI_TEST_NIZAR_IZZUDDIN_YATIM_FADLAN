"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { Button } from "../button";
import { PanelRightCloseIcon } from "lucide-react";

export default function Navbar() {
  const { isCollapsed, toggleSidebar, isMobile } = useSidebar();

  if (!isMobile) {
    return null;
  }

  return (
    <>
      <nav className="top-4 flex flex-col flex-wrap items-start justify-start rounded-xl bg-white/10 p-2 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
        <div className="relative mt-[10px] flex h-fit w-fit flex-grow items-center justify-between gap-4 rounded-full bg-white p-2 shadow-lg sm:flex-grow-0 lg:justify-center lg:gap-4">
          <Button
            id="toggle-sidebar"
            size="icon"
            variant="ghost"
            onClick={() => toggleSidebar(!isCollapsed)}
          >
            <PanelRightCloseIcon />
          </Button>
        </div>
      </nav>
    </>
  );
}
