"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  appointmentSchema,
  AppointmentFormData,
  AppointmentStatus,
  statusLabels,
} from "@/types/appointment";
import { Plus, X } from "lucide-react";

interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<AppointmentFormData>;
  isLoading?: boolean;
  patients: Patient[];
  doctors: Doctor[];
}

export default function AppointmentForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  patients,
  doctors,
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          appointmentDate: initialData.appointmentDate
            ? new Date(initialData.appointmentDate).toISOString().slice(0, 16)
            : "",
        }
      : {
          doctorId: doctors[0]?.id || "",
          patientId: patients[0]?.id || "",
          status: "SCHEDULED",
        },
  });

  const handleFormSubmit = async (data: AppointmentFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const selectedDoctor = watch("doctorId");
  const selectedPatient = watch("patientId");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {initialData?.id ? "Edit Appointment" : "Schedule New Appointment"}
        </CardTitle>
        <CardDescription>
          {initialData?.id
            ? "Update appointment information"
            : "Schedule an appointment for a patient"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="patientId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Patient *
              </label>
              <select
                {...register("patientId")}
                id="patientId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.patientId.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="doctorId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Doctor *
              </label>
              <select
                {...register("doctorId")}
                id="doctorId"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.doctorId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date & Time *
            </label>
            <input
              {...register("appointmentDate")}
              type="datetime-local"
              id="appointmentDate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.appointmentDate.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="caseDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Case Description
            </label>
            <textarea
              {...register("caseDescription")}
              id="caseDescription"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the case or reason for visit"
            />
            {errors.caseDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.caseDescription.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status *
              </label>
              <select
                {...register("status")}
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="charge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Charge (₹)
              </label>
              <input
                {...register("charge", { valueAsNumber: true })}
                type="number"
                id="charge"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter charge amount"
              />
              {errors.charge && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.charge.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : initialData?.id
                ? "Update Appointment"
                : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
