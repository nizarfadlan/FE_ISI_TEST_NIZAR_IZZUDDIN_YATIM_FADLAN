import Sidebar from "@/components/sidebar";
import { Providers } from "../providers";
import Overlay from "@/components/sidebar/overlay";
import SidebarProvider from "@/hooks/useSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <div className="relative top-0">
          <Overlay />
          <div className="flex h-full w-full bg-gray-100">
            <Sidebar />
            <div className="h-full w-full">
              <main className="mx-2.5 flex-none transition-all md:pr-2 xl:ml-[280px]">
                <div className="flex min-h-screen flex-col justify-between">
                  <div className="mt-5 p-2 !pt-[10px] md:p-2">{children}</div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
