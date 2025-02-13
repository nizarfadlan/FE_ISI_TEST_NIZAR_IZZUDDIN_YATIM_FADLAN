import type { z } from "zod";
import { userSelectSchema } from "../db/schema";

export const profileResponseSchema = userSelectSchema.omit({
  password: true,
});
export type ProfileResponseDTO = z.infer<typeof profileResponseSchema>;
