import AddUserForm from "@/components/dashboard/users/add-user-form";
import { useModalDialog } from "@/hooks/useModalDialog";
import { queryClient } from "@/lib/query";
import { useCreateUser } from "@/server/users/query";
import {
  createUserRequestSchema,
  type CreateUserRequestDTO,
} from "@/server/users/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

export default function AddUser() {
  const { closeModal } = useModalDialog();
  const form = useForm<CreateUserRequestDTO>({
    resolver: zodResolver(createUserRequestSchema),
    mode: "onChange",
    defaultValues: {
      role: "team",
    },
  });

  const { handleSubmit, setError, reset } = form;

  const { mutate } = useCreateUser({
    setFormError: setError,
    successMessage: "User created successfully",
    errorMessage: "Failed to create user",
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      reset();
      closeModal();
    },
  });

  const onSubmit: SubmitHandler<CreateUserRequestDTO> = (data) => {
    mutate(data);
  };

  return <AddUserForm form={form} onSubmit={handleSubmit(onSubmit)} />;
}
