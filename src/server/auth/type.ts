import { z } from "zod";

export const loginFormRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginFormRequestDTO = z.infer<typeof loginFormRequestSchema>;

export const loginFormResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type LoginFormResponseDTO = z.infer<typeof loginFormResponseSchema>;

export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenRequestDTO = z.infer<typeof refreshTokenRequestSchema>;

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type RefreshTokenResponseDTO = z.infer<
  typeof refreshTokenResponseSchema
>;

export const logoutRequestSchema = z.object({
  refreshToken: z.string(),
});
export type LogoutRequestDTO = z.infer<typeof logoutRequestSchema>;
