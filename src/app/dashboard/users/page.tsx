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
import { Plus, RefreshCcw } from "lucide-react";
import AddUser from "./add-user";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { queryClient } from "@/lib/query";
import { Button } from "@/components/button";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmModal } from "@/components/modal/confirm-modal";

export default function Users() {
  const { showModal } = useModalDialog();
  const { data, isLoading, isFetching, refetch } = useGetUsers();
  const { user, loading } = useAuthStore();
  const navigate = useRouter();
  const { showDialog: showDialogConfirm } = useConfirmDialog();

  useEffect(() => {
    if (user && user.role !== "lead" && !loading.auth) {
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
      anotherChildHeader={
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCcw />
          Refresh
        </Button>
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
            showDialogConfirm({
              title: "Delete User",
              description: "Are you sure you want to delete this user?",
              onConfirm: () => {
                mutateDelete({ id });
              },
            });
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
      <ConfirmModal />
    </Card>
  );
}
