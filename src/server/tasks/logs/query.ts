import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { GetTaskLogsRequestDTO, GetTaskLogsResponseDTO } from "./type";
import { api, apiCall } from "@/lib/axios";
import { ClientError } from "@/utils/error";
import type { ApiResponse } from "@/types";

type PageData = GetTaskLogsResponseDTO;
type ApiResponseResult = ApiResponse<PageData>;

export function useGetTaskLogs(
  params?: GetTaskLogsRequestDTO,
  options?: Omit<
    UseInfiniteQueryOptions<ApiResponseResult, ClientError, PageData>,
    "queryKey" | "queryFn" | "getNextPageParam"
  >,
) {
  return useInfiniteQuery<ApiResponseResult, ClientError, PageData>({
    queryKey: ["tasks", "logs", params] as const,
    queryFn: async ({ pageParam = undefined }) => {
      const result = await apiCall(
        api.get<ApiResponseResult>("/api/tasks/logs", {
          params: { ...params, cursor: pageParam },
        }),
      );

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
    select: (data) => {
      const lastPage = data.pages[data.pages.length - 1];
      return {
        logs: data.pages.flatMap((page) =>
          page.success && page.data?.logs ? page.data.logs : [],
        ),
        nextCursor:
          lastPage?.success && lastPage.data
            ? lastPage.data.nextCursor
            : undefined,
      } as PageData;
    },
    getNextPageParam: (lastPage) =>
      lastPage.success && lastPage.data?.nextCursor
        ? lastPage.data.nextCursor
        : undefined,
    initialPageParam: undefined,
    ...options,
  });
}
