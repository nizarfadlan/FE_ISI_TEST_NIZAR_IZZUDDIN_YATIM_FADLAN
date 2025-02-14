"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { useMemo } from "react";

const style = {
  overlay:
    "bg-black fixed h-screen inset-0 w-screen z-30 xl:hidden bg-opacity-75 transition-opacity",
};

export default function Overlay() {
  const { isCollapsed, isMobile } = useSidebar();
  const showOverlay = useMemo(
    () => isMobile && isCollapsed,
    [isMobile, isCollapsed],
  );

  return <div className={showOverlay ? style.overlay : ""} />;
}
