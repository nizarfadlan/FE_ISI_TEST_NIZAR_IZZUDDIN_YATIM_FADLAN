"use client";

import { useAuthStore } from "@/stores/useAuthStore";
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

export default function AuthForm() {
  const { user, login, logout, error, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormRequestDTO>({
    resolver: zodResolver(loginFormRequestSchema),
  });

  const onSubmit: SubmitHandler<LoginFormRequestDTO> = async (data) => {
    await login(data.username, data.password);
  };

  if (loading.auth) {
    return <Loading text="Logging in..." className="text-black" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Input
          type="password"
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
