"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex min-h-screen flex-col justify-around bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <h1 className="text-xl font-bold">TeamTodo</h1>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="ring-offset-background focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium text-black underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="ring-offset-background focus-visible:ring-ring inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium text-black underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto flex w-full max-w-7xl flex-grow items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="mt-auto bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Nizar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
