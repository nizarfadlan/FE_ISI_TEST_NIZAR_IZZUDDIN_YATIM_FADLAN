"use client";

import { Card } from "@/components/card";
import EditPasswordUserForm from "@/components/dashboard/users/edit-password-user-form";
import EditProfileForm, {
  EditProfileFormSkeleton,
} from "@/components/dashboard/users/edit-profile-form";
import Loading from "@/components/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { queryClient } from "@/lib/query";
import {
  useGetProfile,
  useUpdatePassword,
  useUpdateUser,
} from "@/server/users/query";
import {
  updatePasswordRequestSchema,
  updateUserMeRequestSchema,
  type UpdatePasswordRequestDTO,
  type UpdateUserMeRequestDTO,
} from "@/server/users/type";
import { toSentenceCase } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function Profile() {
  const navigate = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== "lead" && !loading.auth) {
      toast.error("You are not authorized to access this page");
      navigate.push("/dashboard");
    }
  }, [user, navigate, loading.auth]);

  const { data, isLoading, isFetching } = useGetProfile();

  const formUpdateUser = useForm<UpdateUserMeRequestDTO>({
    resolver: zodResolver(updateUserMeRequestSchema),
    mode: "onChange",
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateUser({
    successMessage: "Profile updated successfully",
    errorMessage: "Failed to update profile",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });

  useEffect(() => {
    if (data?.success) {
      if (!data.data) {
        return;
      }

      const { name, username } = data.data;
      formUpdateUser.reset({
        name,
        username,
      });
    }
  }, [data, formUpdateUser]);

  const onSubmitUpdateUser: SubmitHandler<UpdateUserMeRequestDTO> = (data) => {
    mutateUpdate(data);
  };

  const formUpdatePassword = useForm<UpdatePasswordRequestDTO>({
    resolver: zodResolver(updatePasswordRequestSchema),
    mode: "onChange",
  });

  const { mutate: mutateUpdatePassword, isPending: isPendingUpdatePassword } =
    useUpdatePassword({
      successMessage: "User password updated successfully",
      errorMessage: "Failed to update user password",
    });

  const onSubmitUpdatePassword: SubmitHandler<UpdatePasswordRequestDTO> = (
    data,
  ) => {
    mutateUpdatePassword(data);
  };

  return (
    <div className="space-y-4">
      <Card title="Profile" description="Profile information">
        {data?.success && data.data && !isLoading && !isFetching ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nama</p>
              <p className="text-lg font-semibold">{data?.data.name ?? "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Username</p>
              <p className="text-lg font-semibold">
                {data?.data.username ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-lg font-semibold">
                {toSentenceCase(data?.data.role) ?? "-"}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="h-2 w-14 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-2 w-14 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-2 w-14 animate-pulse rounded-lg bg-gray-200" />
          </div>
        )}
      </Card>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        {(isPendingUpdate || isPendingUpdatePassword) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-200">
            <div className="w-full max-w-xs scale-100 transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-200">
              <Loading className="text-black" text="Update user" />
            </div>
          </div>
        )}
        <Card
          title="Profile"
          description="Profile information"
          className="w-full"
        >
          {data?.success && data.data && !isLoading && !isFetching ? (
            <EditProfileForm
              form={formUpdateUser}
              onSubmit={formUpdateUser.handleSubmit(onSubmitUpdateUser)}
            />
          ) : (
            <EditProfileFormSkeleton />
          )}
        </Card>
        <Card
          title="Edit User Password"
          description="Edit user password"
          className="w-full md:w-9/12"
        >
          <EditPasswordUserForm
            form={formUpdatePassword}
            onSubmit={formUpdatePassword.handleSubmit(onSubmitUpdatePassword)}
          />
        </Card>
      </div>
    </div>
  );
}
