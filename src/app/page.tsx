"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/main-layout";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/button";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Manage Team Tasks</span>
          <span className="block text-indigo-600">Better Together</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Streamline your team&apos;s workflow with our collaborative todo list
          application. Track tasks, assign responsibilities, and achieve goals
          together.
        </p>
        <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
          <Button asChild>
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
