import { z } from "zod";

export const doctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialization: z.array(z.string()).optional(),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;
