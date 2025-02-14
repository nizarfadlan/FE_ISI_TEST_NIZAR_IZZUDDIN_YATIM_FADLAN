"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/utils";

export default function ContainerDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <main
      className={cn(
        "mx-2.5 flex-none transition-all lg:pr-2",
        isCollapsed ? "lg:ml-[6rem]" : "lg:ml-[17.2rem]",
      )}
    >
      {children}
    </main>
  );
}
