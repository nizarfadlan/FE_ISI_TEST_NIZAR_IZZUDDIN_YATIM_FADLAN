import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import MultiSelect from "@/components/multi-select";
import Required from "@/components/required";
import type { Role } from "@/server/db/schema";
import type { UpdateTaskRequestDTO } from "@/server/tasks/type";
import { useGetUserOptions } from "@/server/users/query";
import { Save, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface EditTaskFormProps {
  formEdit: UseFormReturn<UpdateTaskRequestDTO>;
  saveEdit: () => void;
  cancelEditing: () => void;
  isOwner: boolean;
  role?: Role;
}

export default function EditTaskForm({
  formEdit,
  saveEdit,
  cancelEditing,
  role,
  isOwner,
}: EditTaskFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = formEdit;

  const { data: dataUser, isLoading, isFetching } = useGetUserOptions();

  return (
    <div className="space-y-4">
      {role === "lead" && (
        <div>
          <Label htmlFor="title">
            Title
            <Required />
          </Label>
          <Input
            {...register("title", { required: "Title is required" })}
            className="mt-1"
            placeholder="Task Title"
          />
          {errors.title && (
            <p className="my-1 text-red-500">{errors.title.message}</p>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          {...register("description")}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="Task Description"
          rows={2}
        />
        {errors.description && (
          <p className="my-1 text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="status">
          Status
          <Required />
        </Label>
        <select
          {...register("status", { required: "Status is required" })}
          className="border-input mt-1 flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        >
          <option value="not_started">Not Started</option>
          <option value="on_progress">In Progress</option>
          <option value="reject">Rejected</option>
          <option value="done">Completed</option>
        </select>
        {errors.status && (
          <p className="my-1 text-red-500">{errors.status.message}</p>
        )}
      </div>
      {isOwner && (
        <MultiSelect
          options={dataUser?.success && dataUser.data ? dataUser.data : []}
          label="Assignees"
          name="assigneeIds"
          register={register}
          setValue={setValue}
          watch={watch}
          isLoading={isLoading || isFetching}
          error={errors.assigneeIds?.message}
        />
      )}
      <div className="flex items-center justify-end space-x-2">
        <Button onClick={cancelEditing} size="icon" variant="destructive">
          <X className="h-4 w-4" />
        </Button>
        <Button onClick={() => saveEdit()} size="icon">
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
