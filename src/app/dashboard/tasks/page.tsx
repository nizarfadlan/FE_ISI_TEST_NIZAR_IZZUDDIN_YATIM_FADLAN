"use client";

import { Card } from "@/components/card";
import TaskItem, {
  TodoItemSkeleton,
} from "@/components/dashboard/tasks/task-item";
import { useModalDialog } from "@/hooks/useModalDialog";
import {
  updateTaskRequestSchema,
  type UpdateTaskRequestDTO,
} from "@/server/tasks/type";
import { Plus } from "lucide-react";
import { Fragment } from "react";
import AddTask from "./add-task";
import { ModalDialog } from "@/components/modal/modal-dialog";
import { queryClient } from "@/app/providers";
import type { TaskStatus } from "@/server/db/schema";
import Loading from "@/components/loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteTask,
  useGetTasks,
  useUpdateStatusTask,
  useUpdateTask,
} from "@/server/tasks/query";

export default function Todos() {
  const { showModal } = useModalDialog();
  const { data, isLoading, isFetching } = useGetTasks();

  const { mutate: mutateUpdateStatus, isPending: isPendingUpdateStatus } =
    useUpdateStatusTask({
      successMessage: "Task updated successfully",
      errorMessage: "Failed to update task",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
      },
    });

  const form = useForm<UpdateTaskRequestDTO>({
    resolver: zodResolver(updateTaskRequestSchema),
    mode: "onChange",
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateTask({
    successMessage: "Task updated successfully",
    errorMessage: "Failed to update task",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useDeleteTask({
    successMessage: "Task deleted successfully",
    errorMessage: "Failed to delete task",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  return (
    <Card
      title="Tasks"
      description="List of tasks"
      IconButton={Plus}
      textButton="Create Task"
      callbackButton={() =>
        showModal({
          title: "Create Task",
          content: <AddTask />,
          actionLabel: "Save",
        })
      }
    >
      {(isPendingUpdateStatus || isPendingDelete || isPendingUpdate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-xs scale-100 transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-200">
            <Loading
              className="text-black"
              text={isPendingDelete ? "Delete task" : "Update task"}
            />
          </div>
        </div>
      )}
      {data?.data && !isLoading && !isFetching ? (
        <Fragment>
          {data.data.length > 0 ? (
            data.data.map((todo) => (
              <TaskItem
                key={todo.id}
                task={todo}
                formEdit={form}
                checkTask={(id: string, status: TaskStatus) => {
                  const newStatus = status !== "done" ? "done" : "not_started";

                  mutateUpdateStatus({
                    id,
                    status: newStatus,
                  });
                }}
                saveEdit={(id: string) => {
                  mutateUpdate({
                    id,
                    ...form.getValues(),
                  });
                }}
                deleteTask={(id: string) => {
                  mutateDelete({ id });
                }}
              />
            ))
          ) : (
            <p className="text-center">No todos found</p>
          )}
        </Fragment>
      ) : (
        Array.from({ length: 5 }).map((_, index) => (
          <TodoItemSkeleton key={index} />
        ))
      )}
      <ModalDialog />
    </Card>
  );
}
