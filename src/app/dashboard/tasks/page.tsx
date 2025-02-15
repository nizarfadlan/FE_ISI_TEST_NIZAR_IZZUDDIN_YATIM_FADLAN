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
import { Plus, RefreshCcw } from "lucide-react";
import { useCallback } from "react";
import { ModalDialog } from "@/components/modal/modal-dialog";
import { TaskStatusValues, type TaskStatus } from "@/server/db/schema";
import Loading from "@/components/loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useDeleteTask,
  useGetTasks,
  useUpdateStatusTask,
  useUpdateTask,
} from "@/server/tasks/query";
import { queryClient } from "@/lib/query";
import { Button } from "@/components/button";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import TaskColumn from "@/components/dashboard/tasks/task-column";
import { toSentenceCase } from "@/utils";
import useMedia from "@/hooks/useMedia";
import { useAuthStore } from "@/hooks/useAuthStore";
import AddTask from "./add-task";

export default function Tasks() {
  const { user } = useAuthStore();
  const { showModal } = useModalDialog();
  const { data, isLoading, isFetching, refetch } = useGetTasks();

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
    defaultValues: {
      assigneeIds: [],
    },
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

  const handleDrop = useCallback(
    (id: string, newStatus: TaskStatus) => {
      mutateUpdateStatus({ id, status: newStatus });
    },
    [mutateUpdateStatus],
  );

  const isMobile = useMedia("(max-width: 768px)");
  const Backend = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={Backend}>
      <Card
        title="Tasks"
        description="List of tasks"
        anotherChildHeader={
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCcw />
            Refresh
          </Button>
        }
        {...(user?.role === "lead" && {
          IconButton: Plus,
          textButton: "Create Task",
          callbackButton: () =>
            showModal({
              title: "Create Task",
              content: <AddTask />,
            }),
        })}
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
        {data?.success && data.data && !isLoading && !isFetching ? (
          <div className="flex flex-col gap-4 lg:flex-row">
            {TaskStatusValues.map((status) => (
              <TaskColumn key={status} status={status} onDrop={handleDrop}>
                {(data?.data ?? [])
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      formEdit={form}
                      checkTask={(id: string, status: TaskStatus) => {
                        const newStatus =
                          status !== "done" ? "done" : "not_started";
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
                  ))}
              </TaskColumn>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:flex-row">
            {TaskStatusValues.map((status) => (
              <div key={status} className="flex-1 rounded-md bg-gray-100 p-2">
                <h3 className="my-2 text-center text-lg font-semibold">
                  {toSentenceCase(status)}
                </h3>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <TodoItemSkeleton key={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <ModalDialog />
      </Card>
    </DndProvider>
  );
}
