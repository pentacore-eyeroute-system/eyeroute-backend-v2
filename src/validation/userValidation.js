import { z } from "zod";

export const userSchema = z.object({
  famFirstname: z.string().trim().min(1),
  famLastname: z.string().trim().min(1),
  famGender: z.enum(["Female", "Male", "Prefer Not to Say"]),
});