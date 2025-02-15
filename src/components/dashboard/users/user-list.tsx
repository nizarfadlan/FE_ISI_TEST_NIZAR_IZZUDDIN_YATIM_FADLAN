"use client";

import { Button } from "@/components/button";
import type { GetUsersResponseDTO } from "@/server/users/type";
import { momentDate } from "@/utils/date";
import { ArchiveRestoreIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Fragment } from "react";

interface UserListProps {
  users: GetUsersResponseDTO;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
  onRestore: (userId: string) => void;
}

export default function UserList({
  users,
  onEdit,
  onDelete,
  onRestore,
}: UserListProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-indigo-100 text-sm uppercase leading-normal text-gray-800">
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Username</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Created At</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-600">
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="whitespace-nowrap px-6 py-3 text-left">
                {user.name}
              </td>
              <td className="px-6 py-3 text-left">{user.username}</td>
              <td className="px-6 py-3 text-left">{user.role}</td>
              <td className="px-6 py-3 text-left">
                {momentDate(user.createdAt)}
                {user.deletedAt && (
                  <p>Deleted At: {momentDate(user.deletedAt)}</p>
                )}
              </td>
              <td className="flex space-x-1 px-6 py-3 text-center">
                {user.deletedAt && onRestore ? (
                  <Button
                    onClick={() => onRestore(user.id)}
                    variant="success"
                    size="sm"
                  >
                    <ArchiveRestoreIcon className="h-4 w-4" />
                    <span className="sr-only">Restore</span>
                  </Button>
                ) : (
                  <Fragment>
                    <Button onClick={() => onEdit(user.id)} size="sm">
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </Fragment>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserListSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-sm uppercase leading-normal text-gray-600">
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Username</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Created At</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-600">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td>
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-6 py-3 text-center">
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
