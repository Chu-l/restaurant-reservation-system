import { z } from "zod";

export const createReservationSchema = z.object({
  user: z.string({ required_error: "User ID is required" }).regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
  date: z.string({ required_error: "Date is required" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  time: z.string({ required_error: "Time is required" }).regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must follow HH:mm format"),
  guests: z.number({ required_error: "Number of guests is required" }).min(1, "At least 1 guest is required"),
  specialNotes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

export const updateReservationSchema = createReservationSchema.partial();