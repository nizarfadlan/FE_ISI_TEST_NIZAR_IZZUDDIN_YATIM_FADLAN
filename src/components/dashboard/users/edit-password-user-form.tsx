import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { PasswordInput } from "@/components/password-input";
import Required from "@/components/required";
import type { UpdatePasswordRequestDTO } from "@/server/users/type";
import type { UseFormReturn } from "react-hook-form";

interface EditPasswordUserFormProps {
  form: UseFormReturn<UpdatePasswordRequestDTO>;
  onSubmit: () => void;
}

export default function EditPasswordUserForm({
  form,
  onSubmit,
}: EditPasswordUserFormProps) {
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
        <Label htmlFor="oldPassword">
          Old Password
          <Required />
        </Label>
        <PasswordInput
          {...register("oldPassword", { required: "Old Password is required" })}
          className="mt-1"
          placeholder="Old Password"
        />
        {errors.oldPassword && (
          <p className="my-1 text-red-500">{errors.oldPassword.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="newPassword">
          New Password
          <Required />
        </Label>
        <PasswordInput
          {...register("newPassword", { required: "Old Password is required" })}
          className="mt-1"
          placeholder="New Password"
        />
        {errors.newPassword && (
          <p className="my-1 text-red-500">{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmNewPassword">
          Confirm New Password
          <Required />
        </Label>
        <PasswordInput
          {...register("confirmNewPassword", {
            required: "Confirm Password is required",
          })}
          className="mt-1"
          placeholder="Confirm New Password"
        />
        {errors.confirmNewPassword && (
          <p className="my-1 text-red-500">
            {errors.confirmNewPassword.message}
          </p>
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

export function EditPasswordUserFormSkeleton() {
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
