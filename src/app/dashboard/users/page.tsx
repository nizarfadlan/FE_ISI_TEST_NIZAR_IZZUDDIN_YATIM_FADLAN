"use client";

import { Card } from "@/components/card";
import UserList, {
  UserListSkeleton,
} from "@/components/dashboard/users/user-list";
import { ModalDialog } from "@/components/modal/modal-dialog";
import { useModalDialog } from "@/hooks/useModalDialog";
import {
  useDeleteUser,
  useGetUsers,
  useRestoreUser,
} from "@/server/users/query";
import { Plus } from "lucide-react";
import AddUser from "./add-user";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { queryClient } from "@/app/providers";
import Loading from "@/components/loading";

export default function Users() {
  const { showModal } = useModalDialog();
  const { data, isLoading, isFetching } = useGetUsers();
  const { user, loading } = useAuthStore();
  const navigate = useRouter();

  useEffect(() => {
    if (user?.role !== "lead" && !loading.auth) {
      toast.error("You are not authorized to access this page");
      navigate.push("/dashboard");
    }
  }, [user, navigate, loading.auth]);

  const { mutate: mutateDelete, isPending: isPendingDelete } = useDeleteUser({
    successMessage: "User deleted successfully",
    errorMessage: "Failed to delete user",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const { mutate: mutateRestore, isPending: isPendingRestore } = useRestoreUser(
    {
      successMessage: "User restored successfully",
      errorMessage: "Failed to restore user",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      },
    },
  );

  return (
    <Card
      title="Users"
      description="List of users"
      IconButton={Plus}
      textButton="Create User"
      callbackButton={() =>
        showModal({
          title: "Create User",
          content: <AddUser />,
        })
      }
    >
      {(isPendingDelete || isPendingRestore) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-200">
          <div className="w-full max-w-xs scale-100 transform rounded-lg bg-white p-6 shadow-lg transition-transform duration-200">
            <Loading
              className="text-black"
              text={
                isPendingDelete
                  ? "Delete user"
                  : isPendingRestore
                    ? "Restore user"
                    : "Update user"
              }
            />
          </div>
        </div>
      )}
      {data?.success && data.data && !isLoading && !isFetching ? (
        <UserList
          users={data.data}
          onDelete={(id: string) => {
            mutateDelete({ id });
          }}
          onEdit={(id: string) => {
            navigate.push(`/dashboard/users/${id}`);
          }}
          onRestore={(id: string) => {
            mutateRestore({ id });
          }}
        />
      ) : (
        <UserListSkeleton />
      )}
      <ModalDialog />
    </Card>
  );
}
