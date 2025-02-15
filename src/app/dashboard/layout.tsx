"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { Providers } from "../providers";
import Overlay from "@/components/dashboard/sidebar/overlay";
import SidebarProvider from "@/hooks/useSidebar";
import Navbar from "@/components/dashboard/navbar";
import ContainerDashboard from "@/components/dashboard/container";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <Toaster position="top-right" />
        <div className="relative top-0">
          <Overlay />
          <div className="flex h-full w-full bg-gray-100">
            <Sidebar />
            <div className="h-full w-full">
              <ContainerDashboard>
                <div className="flex min-h-screen flex-col justify-between">
                  <div>
                    <Navbar />
                    <div className="mx-auto mt-5 p-2 !pt-[10px] md:p-2">
                      {children}
                    </div>
                  </div>
                </div>
              </ContainerDashboard>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
