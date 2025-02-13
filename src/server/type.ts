import { z } from "zod";

export const idSchema = z.object({
  id: z.string(),
});
export type IdDTO = z.infer<typeof idSchema>;
