import { z } from "zod";
import {
  userInsertSchema,
  userSelectSchema,
  userUpdateSchema,
} from "../db/schema";

const PasswordValidation = {
  min: 8,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[^a-zA-Z0-9]/,
} as const;

export const PasswordSchema = z
  .string()
  .min(
    PasswordValidation.min,
    `Password must be at least ${PasswordValidation.min} characters long`,
  )
  .regex(
    PasswordValidation.lowercase,
    "Password must contain at least one lowercase letter",
  )
  .regex(
    PasswordValidation.uppercase,
    "Password must contain at least one uppercase letter",
  )
  .regex(PasswordValidation.number, "Password must contain at least one number")
  .regex(
    PasswordValidation.special,
    "Password must contain at least one special character",
  );

export const getUserResponseSchema = userSelectSchema.omit({
  password: true,
});
export type GetUserResponseDTO = z.infer<typeof getUserResponseSchema>;

export const getUserOptionResponseSchema = userSelectSchema.pick({
  id: true,
  name: true,
});
export type GetUserOptionResponseDTO = z.infer<
  typeof getUserOptionResponseSchema
>;

export const getUsersResponseSchema = z.array(getUserResponseSchema);
export type GetUsersResponseDTO = z.infer<typeof getUsersResponseSchema>;

export const createUserRequestSchema = userInsertSchema
  .omit({
    id: true,
    createdAt: true,
    deletedAt: true,
    updatedAt: true,
    password: true,
  })
  .extend({
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password confirmation must match password",
  });
export type CreateUserRequestDTO = z.infer<typeof createUserRequestSchema>;

export const updateUserRequestSchema = userUpdateSchema.omit({
  id: true,
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
  password: true,
});
export type UpdateUserRequestDTO = z.infer<typeof updateUserRequestSchema>;

export const updatePasswordRequestSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: PasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "New password confirmation must match new password",
  });
export type UpdatePasswordRequestDTO = z.infer<
  typeof updatePasswordRequestSchema
>;
