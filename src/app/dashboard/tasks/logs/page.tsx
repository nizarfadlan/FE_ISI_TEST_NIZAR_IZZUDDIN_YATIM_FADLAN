"use client";

import { Card } from "@/components/card";
import Loading from "@/components/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetTaskLogs } from "@/server/tasks/logs/query";
import { cn } from "@/utils";
import { momentDateWithTime } from "@/utils/date";
import { Edit, PlusCircle, Trash, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef } from "react";
import { toast } from "sonner";

const actionIcons: Record<
  string,
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  update: { icon: Edit, color: "text-blue-500", bgColor: "bg-blue-100" },
  delete: { icon: Trash, color: "text-red-500", bgColor: "bg-red-100" },
  create: {
    icon: PlusCircle,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
};

export default function TaskLogs() {
  const { user, loading } = useAuthStore();
  const navigate = useRouter();

  useEffect(() => {
    if (user && user.role !== "lead" && !loading.auth) {
      toast.error("You are not authorized to access this page");
      navigate.push("/dashboard");
    }
  }, [user, navigate, loading.auth]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTaskLogs();

  const lastLogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lastLogRef.current || !hasNextPage) return;

    const observerInstance = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5, rootMargin: "200px" },
    );

    if (lastLogRef.current) {
      observerInstance.observe(lastLogRef.current);
    }

    return () => {
      observerInstance.disconnect();
    };
  }, [hasNextPage, fetchNextPage, data?.logs]);

  return (
    <Card title="Task Logs" description="View all task logs">
      <div className="space-y-3">
        {data?.logs.map((log, index) => {
          const {
            icon: Icon,
            color,
            bgColor,
          } = actionIcons[log.action] ?? {
            icon: PlusCircle,
            color: "text-gray-500",
            bgColor: "bg-gray-100",
          };

          return (
            <div
              key={`${log.id}-${index}`}
              ref={index === data.logs.length - 1 ? lastLogRef : null}
              className={cn(
                "flex items-center space-x-3 rounded-lg p-3 shadow-sm",
                bgColor,
              )}
              data-id={log.id}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-opacity-20",
                  color,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{log.user.name}</span>{" "}
                  {log.action}
                </p>
                {log.action === "delete" ? (
                  <p className="text-xs text-gray-500">TaskId: {log.taskId}</p>
                ) : (
                  <Fragment>
                    {log.title && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Title</span> {log.title}
                      </p>
                    )}
                    {log.description && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Description</span>{" "}
                        {log.description}
                      </p>
                    )}
                    {log.status && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Status</span>{" "}
                        {log.status}
                      </p>
                    )}
                  </Fragment>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  {momentDateWithTime(log.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="mt-4 flex justify-center">
          <Loading className="text-gray-500" text="Loading more logs" />
        </div>
      )}
    </Card>
  );
}
