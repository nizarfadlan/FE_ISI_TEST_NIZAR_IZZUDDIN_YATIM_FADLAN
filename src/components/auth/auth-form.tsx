"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useForm } from "react-hook-form";
import Loading from "../loading";
import { Input } from "../input";
import { Button } from "../button";
import { Label } from "../label";

interface FormData {
  username: string;
  password: string;
}

export default function AuthForm() {
  const { user, login, logout, error, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await login(data.username, data.password);
  };

  if (loading.auth) {
    return <Loading text="Logging in..." className="text-black" />;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-4 space-y-6 rounded-lg bg-white px-8 pb-8 pt-6 shadow-lg"
    >
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          {...register("password", { required: "Password is required" })}
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
