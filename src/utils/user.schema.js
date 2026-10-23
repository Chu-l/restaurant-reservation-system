import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters long"),
  email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "client"]).optional(),
});

export const updateUserSchema = createUserSchema.partial();