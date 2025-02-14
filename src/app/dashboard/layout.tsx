"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { Providers } from "../providers";
import Overlay from "@/components/dashboard/sidebar/overlay";
import SidebarProvider, { useSidebar } from "@/hooks/useSidebar";
import Navbar from "@/components/dashboard/navbar";
import { cn } from "@/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <Providers>
      <SidebarProvider>
        <div className="relative top-0">
          <Overlay />
          <div className="flex h-full w-full bg-gray-100">
            <Sidebar />
            <div className="h-full w-full">
              <main
                className={cn(
                  "mx-2.5 flex-none transition-all lg:pr-2",
                  isCollapsed ? "lg:ml-0" : "lg:ml-[17.5rem]",
                )}
              >
                <div className="flex min-h-screen flex-col justify-between">
                  <div>
                    <Navbar />
                    <div className="mx-auto mt-5 p-2 !pt-[10px] md:p-2">
                      {children}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
