import {
  createMutationOptions,
  type DefaultMutationOptions,
} from "@/lib/query";
import {
  useMutation,
  useQuery,
  type QueryOptions,
} from "@tanstack/react-query";
import type {
  CreateTaskRequestDTO,
  GetTasksResponseDTO,
  UpdateStatusTaskRequestDTO,
  UpdateTaskRequestDTO,
} from "./type";
import type { ApiResponse } from "@/types";
import { api, apiCall } from "@/lib/axios";
import { ClientError } from "@/utils/error";
import type { IdDTO } from "../type";

export function useGetTasks(
  options?: QueryOptions<ApiResponse<GetTasksResponseDTO>>,
) {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const result = (await apiCall(
        api.get("/api/tasks"),
      )) as ApiResponse<GetTasksResponseDTO>;

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
    ...options,
  });
}

export function useCreateTask(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    CreateTaskRequestDTO
  >,
) {
  return useMutation<ApiResponse<undefined>, unknown, CreateTaskRequestDTO>({
    mutationFn: async (data: CreateTaskRequestDTO) => {
      const result = (await apiCall(
        api.post("/api/tasks", data),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useUpdateStatusTask(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    UpdateStatusTaskRequestDTO & IdDTO
  >,
) {
  return useMutation<
    ApiResponse<undefined>,
    unknown,
    UpdateStatusTaskRequestDTO & IdDTO
  >({
    mutationFn: async (data: UpdateStatusTaskRequestDTO & IdDTO) => {
      const { id, ...rest } = data;
      const result = (await apiCall(
        api.patch(`/api/tasks/${id}/status`, rest),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useUpdateTask(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    UpdateTaskRequestDTO & IdDTO
  >,
) {
  return useMutation<
    ApiResponse<undefined>,
    unknown,
    UpdateTaskRequestDTO & IdDTO
  >({
    mutationFn: async (data: UpdateTaskRequestDTO & IdDTO) => {
      const { id, ...rest } = data;
      const result = (await apiCall(
        api.patch(`/api/tasks/${id}`, rest),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useDeleteTask(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    IdDTO
  >,
) {
  return useMutation<ApiResponse<undefined>, unknown, IdDTO>({
    mutationFn: async (data: IdDTO) => {
      const { id } = data;
      const result = (await apiCall(
        api.delete(`/api/tasks/${id}`),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}
