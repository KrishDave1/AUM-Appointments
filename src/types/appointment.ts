import { z } from "zod";

export const AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;

export type AppointmentStatusType =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  caseDescription: z.string().optional(),
  appointmentDate: z.coerce.date(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  charge: z.number().min(0).optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema> & {
  id?: string;
};

export const statusLabels = {
  [AppointmentStatus.SCHEDULED]: "Scheduled",
  [AppointmentStatus.COMPLETED]: "Completed",
  [AppointmentStatus.CANCELLED]: "Cancelled",
  [AppointmentStatus.NO_SHOW]: "No Show",
} as const;

export const statusColors = {
  [AppointmentStatus.SCHEDULED]: "bg-blue-100 text-blue-800",
  [AppointmentStatus.COMPLETED]: "bg-green-100 text-green-800",
  [AppointmentStatus.CANCELLED]: "bg-gray-100 text-gray-800",
  [AppointmentStatus.NO_SHOW]: "bg-red-100 text-red-800",
} as const;

// Maximum patients per time slot
export const MAX_PATIENTS_PER_SLOT = 5;
