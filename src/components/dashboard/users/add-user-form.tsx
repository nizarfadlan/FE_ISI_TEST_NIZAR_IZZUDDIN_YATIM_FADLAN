import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { PasswordInput } from "@/components/password-input";
import Required from "@/components/required";
import type { CreateUserRequestDTO } from "@/server/users/type";
import type { UseFormReturn } from "react-hook-form";

interface AddUserFormProps {
  form: UseFormReturn<CreateUserRequestDTO>;
  onSubmit: () => void;
}

export default function AddUserForm({ form, onSubmit }: AddUserFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errors.root && (
        <p className="my-1 text-red-500">{errors.root.message}</p>
      )}
      <div>
        <Label htmlFor="name">
          Name
          <Required />
        </Label>
        <Input
          {...register("name", { required: "Name is required" })}
          className="mt-1"
          placeholder="Name"
        />
        {errors.name && (
          <p className="my-1 text-red-500">{errors.name.message}</p>
        )}
      </div>
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
        {errors.username && (
          <p className="my-1 text-red-500">{errors.username.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="role">
          Role
          <Required />
        </Label>
        <select
          {...register("role", { required: "Role is required" })}
          className="border-input mt-1 flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <option value="lead">Lead</option>
          <option value="team">Team</option>
        </select>
        {errors.role && (
          <p className="my-1 text-red-500">{errors.role.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">
          Password
          <Required />
        </Label>
        <PasswordInput
          {...register("password", { required: "Password is required" })}
          className="mt-1"
          placeholder="User Password"
        />
        {errors.password && (
          <p className="my-1 text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">
          Confirm Password
          <Required />
        </Label>
        <PasswordInput
          {...register("confirmPassword", {
            required: "Confirm Password is required",
          })}
          className="mt-1"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="my-1 text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}
