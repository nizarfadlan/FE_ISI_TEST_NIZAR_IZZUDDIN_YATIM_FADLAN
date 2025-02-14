"use client";

import {
  CardStatistic,
  CardStatisticSkeleton,
} from "@/components/card-statistic";
import { api, apiCall } from "@/lib/axios";
import type { StatisticsDTO } from "@/server/type";
import type { ApiResponse } from "@/types";
import { ClientError } from "@/utils/error";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";

export default function Dashboard() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const result = (await apiCall(
        api.get("/api/statistics"),
      )) as ApiResponse<StatisticsDTO>;

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!isLoading && !isFetching && data ? (
          <Fragment>
            <CardStatistic
              title="Total Tasks"
              value={String(data.data?.tasks) ?? "0"}
            />
            <CardStatistic
              title="Completed Tasks"
              value={String(data.data?.taskCompleted) ?? "0"}
            />
            <CardStatistic
              title="Rejected Tasks"
              value={String(data.data?.taskRejected) ?? "0"}
            />
            <CardStatistic
              title="Total Users"
              value={String(data.data?.users) ?? "0"}
            />
          </Fragment>
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <CardStatisticSkeleton key={index} />
          ))
        )}
      </div>
    </div>
  );
}
