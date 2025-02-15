"use client";

import { Card } from "@/components/card";
import EditPasswordUserForm, {
  EditPasswordUserFormSkeleton,
} from "@/components/dashboard/users/edit-password-user-form";
import EditUserForm, {
  EditUserFormSkeleton,
} from "@/components/dashboard/users/edit-user-form";
import Loading from "@/components/loading";
import { useAuthStore } from "@/hooks/useAuthStore";
import { queryClient } from "@/lib/query";
import {
  useGetUser,
  useUpdatePasswordWithId,
  useUpdateUserWithId,
} from "@/server/users/query";
import {
  updatePasswordRequestSchema,
  updateUserRequestSchema,
  type UpdatePasswordRequestDTO,
  type UpdateUserRequestDTO,
} from "@/server/users/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

export default function EditUserClient({ id }: { id: string }) {
  const navigate = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== "lead" && !loading.auth) {
      toast.error("You are not authorized to access this page");
      navigate.push("/dashboard");
    }
  }, [user, navigate, loading.auth]);

  const { data, isLoading, isFetching } = useGetUser(id);

  const formUpdateUser = useForm<UpdateUserRequestDTO>({
    resolver: zodResolver(updateUserRequestSchema),
    mode: "onChange",
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } =
    useUpdateUserWithId({
      successMessage: "User updated successfully",
      errorMessage: "Failed to update user",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
        navigate.push("/dashboard/users");
      },
    });

  useEffect(() => {
    if (data?.success) {
      if (!data.data) {
        return;
      }

      const { name, username, role } = data.data;
      formUpdateUser.reset({
        name,
        username,
        role,
      });
    }
  }, [data, formUpdateUser]);

  const onSubmitUpdateUser: SubmitHandler<UpdateUserRequestDTO> = (data) => {
    const updateData = {
      ...data,
      id,
    };
    mutateUpdate(updateData);
  };

  const formUpdatePassword = useForm<UpdatePasswordRequestDTO>({
    resolver: zodResolver(updatePasswordRequestSchema),
    mode: "onChange",
  });

  const { mutate: mutateUpdatePassword, isPending: isPendingUpdatePassword } =
    useUpdatePasswordWithId({
      successMessage: "User password updated successfully",
      errorMessage: "Failed to update user password",
      onSuccess: () => {
        navigate.push("/dashboard/users");
      },
    });

  const onSubmitUpdatePassword: SubmitHandler<UpdatePasswordRequestDTO> = (
    data,
  ) => {
    const updateData = {
      ...data,
      id,
    };
    mutateUpdatePassword(updateData);
  };

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
      {(isPendingUpdate || isPendingUpdatePassword) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-xs scale-100 transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-200">
            <Loading className="text-black" text="Update user" />
          </div>
        </div>
      )}
      <Card
        title="Edit User"
        description="Edit user details"
        IconButton={ArrowLeft}
        textButton="Back"
        callbackButton={() => navigate.push("/dashboard/users")}
        positionButton="left"
        className="w-full"
      >
        {data?.success && data.data && !isLoading && !isFetching ? (
          <EditUserForm
            form={formUpdateUser}
            onSubmit={formUpdateUser.handleSubmit(onSubmitUpdateUser)}
          />
        ) : (
          <EditUserFormSkeleton />
        )}
      </Card>
      <Card
        title="Edit User Password"
        description="Edit user password"
        className="w-full md:w-9/12"
      >
        {id ? (
          <EditPasswordUserForm
            form={formUpdatePassword}
            onSubmit={formUpdatePassword.handleSubmit(onSubmitUpdatePassword)}
          />
        ) : (
          <EditPasswordUserFormSkeleton />
        )}
      </Card>
    </div>
  );
}
