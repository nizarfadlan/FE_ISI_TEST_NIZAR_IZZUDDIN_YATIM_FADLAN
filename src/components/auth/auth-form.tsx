"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useForm } from "react-hook-form";
import Loading from "../loading";

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

  if (loading) {
    return <Loading text="Logging in..." />;
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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            placeholder="Enter your username"
          />
          {errors.username && <p>{errors.username.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter your password"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
