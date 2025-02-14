import { queryClient } from "@/app/providers";
import AddTaskForm from "@/components/dashboard/tasks/add-task-form";
import { useModalDialog } from "@/hooks/useModalDialog";
import { api, apiCall } from "@/lib/axios";
import { createMutationOptions } from "@/lib/query";
import {
  createTaskRequestSchema,
  type CreateTaskRequestDTO,
} from "@/server/tasks/type";
import type { ApiResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function AddTask() {
  const { showModal, closeModal } = useModalDialog();
  const form = useForm<CreateTaskRequestDTO>({
    resolver: zodResolver(createTaskRequestSchema),
    mode: "onChange",
    defaultValues: {
      status: "not_started",
    },
  });

  const { handleSubmit, setError, reset } = form;

  const { mutate } = useMutation<
    ApiResponse<undefined>,
    unknown,
    CreateTaskRequestDTO
  >({
    mutationFn: async (data: CreateTaskRequestDTO) => {
      const result = (await apiCall(
        api.post("/api/tasks", data),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...createMutationOptions({
      setFormError: setError,
      successMessage: "Task created successfully",
      errorMessage: "Failed to create task",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
        reset();
        closeModal();
      },
    }),
  });

  const onSubmit: SubmitHandler<CreateTaskRequestDTO> = (data) => {
    mutate(data);
  };

  return <AddTaskForm form={form} onSubmit={handleSubmit(onSubmit)} />;
}
