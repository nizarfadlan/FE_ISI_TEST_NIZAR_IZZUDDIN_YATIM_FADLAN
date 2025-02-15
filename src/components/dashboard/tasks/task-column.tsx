import type { TaskStatus } from "@/server/db/schema";
import { toSentenceCase } from "@/utils";
import { useDrop } from "react-dnd";
import { TaskItemTypes } from "./task-item";
import type React from "react";

interface TaskColumnProps {
  status: TaskStatus;
  children: React.ReactNode;
  onDrop: (id: string, status: TaskStatus) => void;
}

export default function TaskColumn({
  status,
  children,
  onDrop,
}: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: TaskItemTypes.TASK,
    drop: (item: { id: string; status: TaskStatus }) => onDrop(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 rounded-md bg-gray-100 p-2">
      <h3 className="my-2 text-center text-lg font-semibold">
        {toSentenceCase(status)}
      </h3>
      <div
        ref={drop as unknown as React.RefObject<HTMLDivElement>}
        className={`min-h-[100px] rounded-md p-2 transition-all duration-200 ${
          isOver
            ? "border-2 border-dashed border-gray-400 bg-gray-200"
            : "border-2 border-transparent"
        }`}
      >
        {isOver && (
          <div className="mb-2 flex h-16 items-center justify-center">
            <p className="text-gray-500">Drop here</p>
          </div>
        )}
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
