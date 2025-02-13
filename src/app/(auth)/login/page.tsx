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
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>
      <AuthForm />
    </div>
  );
}
