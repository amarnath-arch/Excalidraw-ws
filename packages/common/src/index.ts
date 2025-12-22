import { z } from "zod";

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string().min(3).max(20).optional(),
  photo: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});
