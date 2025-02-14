"use client";

import AuthForm from "@/components/auth/auth-form";
import { Button } from "@/components/button";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">
          You are already logged in
        </h1>
        <Button asChild>
          <Link href="/">Go to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
