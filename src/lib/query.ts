import { ClientError } from "@/utils/error";
import type {
  MutationOptions,
  QueryKey,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { FieldValues, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

export interface MutationCallbacks<
  TData = unknown,
  TError = unknown,
  TContext = unknown,
> {
  onSuccess?: (data: TData, context: TContext | undefined) => void;
  onError?: (error: TError, context: TContext | undefined) => void;
}

export interface DefaultMutationOptions<
  TData = unknown,
  TError = unknown,
  TContext = unknown,
  TFieldValues extends FieldValues = FieldValues,
> extends MutationCallbacks<TData, TError, TContext> {
  setFormError?: UseFormSetError<TFieldValues>;
  successMessage?: string;
  errorMessage?: string;
}

export type QueryOptions<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>;

export function createMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
  TFieldValues extends FieldValues = FieldValues,
>({
  setFormError,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
  ...options
}: DefaultMutationOptions<TData, TError, TContext, TFieldValues> &
  MutationOptions<TData, TError, TVariables, TContext>): MutationOptions<
  TData,
  TError,
  TVariables,
  TContext
> {
  return {
    ...options,
    onSuccess: (data, _, context) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data, context);
    },
    onError: (error, _, context) => {
      if (error instanceof ClientError && error.error.details && setFormError) {
        Object.entries(error.error.details).forEach(([field, messages]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setFormError(field as any, {
            type: "server",
            message: Array.isArray(messages)
              ? messages.join(".\n")
              : (messages as string),
          });
        });
      }

      if (error instanceof ClientError) {
        let detailError = "";
        if (error.error.details) {
          detailError = Object.entries(error.error.details)
            .map(([field, messages]) => {
              return `${field}: ${Array.isArray(messages) ? messages.join(".\n") : messages}`;
            })
            .join("\n");
        }
        toast.error(error.message ?? errorMessage ?? "Terjadi kesalahan", {
          description: detailError,
        });
      } else {
        toast.error(errorMessage ?? "Terjadi kesalahan yang tidak diketahui");
      }

      onError?.(error as TError, context);
    },
  };
}
