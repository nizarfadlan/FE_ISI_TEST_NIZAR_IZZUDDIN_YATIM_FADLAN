"use client";

import { useCallback, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Edit,
  Trash,
  User,
  XCircle,
} from "lucide-react";
import type { GetTaskDTO, UpdateTaskRequestDTO } from "@/server/tasks/type";
import { momentDate } from "@/utils/date";
import type { TaskStatus } from "@/server/db/schema";
import { cn, toSentenceCase } from "@/utils";
import type { UseFormReturn } from "react-hook-form";
import EditTaskForm from "./edit-task-form";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/button";
import { useDrag } from "react-dnd";

interface TaskItemProps {
  task: GetTaskDTO;
  formEdit: UseFormReturn<UpdateTaskRequestDTO>;
  checkTask: (id: string, status: TaskStatus) => void;
  saveEdit: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const TaskItemTypes = {
  TASK: "task",
};

export default function TaskItem({
  task,
  formEdit,
  checkTask,
  saveEdit,
  deleteTask,
}: TaskItemProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const { setValue, reset } = formEdit;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: TaskItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const startEditing = useCallback(() => {
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("status", task.status);
    setValue("assigneeIds", task.assigneeIds);

    setIsEditing(true);
  }, [task, setValue, setIsEditing]);

  const cancelEditing = useCallback(() => {
    reset({
      title: "",
      description: "",
      status: "not_started",
      assigneeIds: [],
    });
    setIsEditing(false);
  }, [reset, setIsEditing]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "not_started":
        return "bg-gray-100 text-gray-800";
      case "on_progress":
        return "bg-yellow-100 text-yellow-800";
      case "reject":
        return "bg-red-100 text-red-800";
      case "done":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      className={cn(
        "group cursor-move rounded-lg bg-gray-50 p-4 shadow-sm",
        isDragging && "opacity-50",
      )}
    >
      {isEditing ? (
        <EditTaskForm
          formEdit={formEdit}
          saveEdit={() => {
            saveEdit(task.id);
            cancelEditing();
          }}
          cancelEditing={cancelEditing}
          role={user?.role}
          isOwner={user?.id === task.createdById}
        />
      ) : (
        <div className="flex items-center">
          <button
            onClick={() => checkTask(task.id, task.status)}
            className="mr-4 flex-shrink-0"
          >
            {task.status === "done" ? (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            ) : task.status === "on_progress" ? (
              <Clock className="h-6 w-6 text-yellow-500" />
            ) : task.status === "reject" ? (
              <XCircle className="h-6 w-6 text-red-500" />
            ) : (
              <Circle className="h-6 w-6 text-gray-400" />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between space-x-2">
              <h3 className="text-lg text-gray-900">{task.title}</h3>
              <div className="invisible flex items-center space-x-1 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                {user?.role === "lead" && user.id === task.createdById && (
                  <Button
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:bg-red-200 hover:text-red-700"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  onClick={startEditing}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                >
                  <Edit className="h-5 w-5" />
                </Button>
              </div>
            </div>
            {task.description && (
              <p className="mt-1 text-gray-600">{task.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center text-sm text-gray-600">
                <User className="mr-1 h-4 w-4" />
                {task.createdBy}
              </span>
              <span className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-1 h-4 w-4" />
                {momentDate(task.updatedAt)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs",
                  getStatusColor(task.status),
                )}
              >
                {toSentenceCase(task.status)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TodoItemSkeleton() {
  return (
    <div className="animate-pulse border-b border-gray-200 p-4">
      <div className="flex items-center">
        <div className="mr-4 flex-shrink-0">
          <Circle className="h-6 w-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="mt-1 h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="mt-2 flex items-center space-x-4">
            <span className="flex items-center text-sm text-gray-600">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200"></div>
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200"></div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
