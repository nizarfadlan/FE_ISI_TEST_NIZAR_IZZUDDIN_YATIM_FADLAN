import { queryClient } from "@/app/providers";
import AddTaskForm from "@/components/dashboard/tasks/add-task-form";
import { useModalDialog } from "@/hooks/useModalDialog";
import { useCreateTask } from "@/server/tasks/query";
import {
  createTaskRequestSchema,
  type CreateTaskRequestDTO,
} from "@/server/tasks/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function AddTask() {
  const { closeModal } = useModalDialog();
  const form = useForm<CreateTaskRequestDTO>({
    resolver: zodResolver(createTaskRequestSchema),
    mode: "onChange",
    defaultValues: {
      status: "not_started",
    },
  });

  const { handleSubmit, setError, reset } = form;

  const { mutate } = useCreateTask({
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
  });

  const onSubmit: SubmitHandler<CreateTaskRequestDTO> = (data) => {
    mutate(data);
  };

  return <AddTaskForm form={form} onSubmit={handleSubmit(onSubmit)} />;
}
