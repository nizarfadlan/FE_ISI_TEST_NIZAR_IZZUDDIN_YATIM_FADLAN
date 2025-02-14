"use client";

import { useSidebar } from "@/hooks/useSidebar";

const style = {
  overlay:
    "bg-black fixed h-screen inset-0 w-screen z-30 xl:hidden bg-opacity-75 transition-opacity",
};

export default function Overlay() {
  const { isCollapsed, isMobile } = useSidebar();
  return <div className={isMobile && isCollapsed ? style.overlay : ""} />;
}
