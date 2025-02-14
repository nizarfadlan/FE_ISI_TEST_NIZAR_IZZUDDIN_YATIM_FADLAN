"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "../button";

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
                <Button variant="link">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button variant="link">
                  <Link href="/login">Login</Link>
                </Button>
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
