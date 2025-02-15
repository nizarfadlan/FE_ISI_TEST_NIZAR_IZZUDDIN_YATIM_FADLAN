import type { ApiResponse } from "@/types";
import {
  useMutation,
  useQuery,
  type QueryOptions,
} from "@tanstack/react-query";
import type {
  CreateUserRequestDTO,
  GetUserOptionResponseDTO,
  GetUserResponseDTO,
  GetUsersResponseDTO,
  UpdatePasswordRequestDTO,
  UpdateUserMeRequestDTO,
  UpdateUserRequestDTO,
} from "./type";
import { api, apiCall } from "@/lib/axios";
import { ClientError } from "@/utils/error";
import {
  createMutationOptions,
  type DefaultMutationOptions,
} from "@/lib/query";
import type { IdDTO } from "../type";

export function useGetProfile(
  options?: QueryOptions<ApiResponse<GetUserResponseDTO>>,
) {
  return useQuery<ApiResponse<GetUserResponseDTO>>({
    queryKey: ["me"],
    queryFn: async () => {
      const result = (await apiCall(
        api.get("/api/users/me"),
      )) as ApiResponse<GetUserResponseDTO>;

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
    ...options,
  });
}

export function useGetUser(
  id: string,
  options?: QueryOptions<ApiResponse<GetUserResponseDTO>>,
) {
  return useQuery<ApiResponse<GetUserResponseDTO>>({
    queryKey: ["user", id],
    queryFn: async () => {
      const result = (await apiCall(
        api.get(`/api/users/${id}`),
      )) as ApiResponse<GetUserResponseDTO>;

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
    enabled: !!id,
    ...options,
  });
}

export function useGetUserOptions(
  options?: QueryOptions<ApiResponse<GetUserOptionResponseDTO[]>>,
) {
  return useQuery<ApiResponse<GetUserOptionResponseDTO[]>>({
    queryKey: ["user-options"],
    queryFn: async () => {
      const result = (await apiCall(
        api.get("/api/users/options"),
      )) as ApiResponse<GetUserOptionResponseDTO[]>;

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
    ...options,
  });
}

export function useGetUsers(
  options?: QueryOptions<ApiResponse<GetUsersResponseDTO>>,
) {
  return useQuery<ApiResponse<GetUsersResponseDTO>>({
    queryKey: ["users"],
    queryFn: async () => {
      const result = (await apiCall(
        api.get("/api/users"),
      )) as ApiResponse<GetUsersResponseDTO>;

      if (!result.success) {
        throw new ClientError(result.error.message, result.error.status);
      }

      return result;
    },
    ...options,
  });
}

export function useCreateUser(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    CreateUserRequestDTO
  >,
) {
  return useMutation<ApiResponse<undefined>, unknown, CreateUserRequestDTO>({
    mutationFn: async (data: CreateUserRequestDTO) => {
      const result = (await apiCall(
        api.post("/api/users", data),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useUpdateUser(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    UpdateUserMeRequestDTO
  >,
) {
  return useMutation<ApiResponse<undefined>, unknown, UpdateUserMeRequestDTO>({
    mutationFn: async (data: UpdateUserMeRequestDTO) => {
      const result = (await apiCall(
        api.patch("/api/users", data),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useUpdateUserWithId(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    UpdateUserRequestDTO & IdDTO
  >,
) {
  return useMutation<
    ApiResponse<undefined>,
    unknown,
    UpdateUserRequestDTO & IdDTO
  >({
    mutationFn: async (data: UpdateUserRequestDTO & IdDTO) => {
      const { id, ...rest } = data;
      const result = (await apiCall(
        api.patch(`/api/users/${id}`, rest),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useUpdatePassword(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    UpdatePasswordRequestDTO
  >,
) {
  return useMutation<ApiResponse<undefined>, unknown, UpdatePasswordRequestDTO>(
    {
      mutationFn: async (data: UpdatePasswordRequestDTO) => {
        const result = (await apiCall(
          api.patch("/api/users/password", data),
        )) as ApiResponse<undefined>;

        return result;
      },
      ...(options ? createMutationOptions(options) : {}),
    },
  );
}

export function useUpdatePasswordWithId(
  options?: DefaultMutationOptions<
    ApiResponse<undefined>,
    unknown,
    unknown,
    UpdatePasswordRequestDTO & IdDTO
  >,
) {
  return useMutation<
    ApiResponse<undefined>,
    unknown,
    UpdatePasswordRequestDTO & IdDTO
  >({
    mutationFn: async (data: UpdatePasswordRequestDTO & IdDTO) => {
      const { id, ...rest } = data;
      const result = (await apiCall(
        api.patch(`/api/users/${id}/password`, rest),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useDeleteUser(
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
        api.delete(`/api/users/${id}`),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}

export function useRestoreUser(
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
        api.patch(`/api/users/${id}/restore`),
      )) as ApiResponse<undefined>;

      return result;
    },
    ...(options ? createMutationOptions(options) : {}),
  });
}
