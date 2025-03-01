"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { useForm, type SubmitHandler } from "react-hook-form";
import Loading from "../loading";
import { Input } from "../input";
import { Button } from "../button";
import { Label } from "../label";
import Required from "../required";
import {
  loginFormRequestSchema,
  type LoginFormRequestDTO,
} from "@/server/auth/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "../password-input";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm() {
  const { login, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormRequestDTO>({
    resolver: zodResolver(loginFormRequestSchema),
  });
  const search = useSearchParams();
  const navigate = useRouter();

  const onSubmit: SubmitHandler<LoginFormRequestDTO> = async (data) => {
    const successLogin = await login(data.username, data.password);

    if (successLogin) {
      toast.success("Successfully logged in", {
        description: "You have been logged in",
      });

      const redirect = search.get("redirect") ?? "/dashboard";
      const validatedRedirect = redirect.startsWith("/");

      navigate.push(validatedRedirect ? redirect : "/dashboard");
    }
  };

  if (loading.auth) {
    return <Loading text="Loading..." className="text-black" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      <div>
        <Label htmlFor="username">
          Username
          <Required />
        </Label>
        <Input
          {...register("username", { required: "Username is required" })}
          className="mt-1"
          placeholder="Username"
        />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">
          Password
          <Required />
        </Label>
        <PasswordInput
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="mt-1"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </div>
    </form>
  );
}
