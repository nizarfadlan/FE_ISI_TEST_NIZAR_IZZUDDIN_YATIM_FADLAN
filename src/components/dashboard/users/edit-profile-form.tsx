import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import Required from "@/components/required";
import type { UpdateUserMeRequestDTO } from "@/server/users/type";
import type { UseFormReturn } from "react-hook-form";

interface EditProfileFormProps {
  form: UseFormReturn<UpdateUserMeRequestDTO>;
  onSubmit: () => void;
}

export default function EditProfileForm({
  form,
  onSubmit,
}: EditProfileFormProps) {
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}

export function EditProfileFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="h-2 w-14 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-9 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="space-y-1">
        <div className="h-2 w-14 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-9 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="space-y-1">
        <div className="h-2 w-14 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-9 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div>
        <div className="h-11 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
