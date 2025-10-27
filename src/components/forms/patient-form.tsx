import { useState } from "react";
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
  patientSchema,
  PatientFormData,
  CaseCategory,
  caseCategoryLabels,
} from "@/types/patient";
import { Plus, X } from "lucide-react";

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<PatientFormData>;
  isLoading?: boolean;
}

export default function PatientForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: PatientFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {initialData ? "Edit Patient" : "Add New Patient"}
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Update patient information"
            : "Enter patient details to add them to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient's full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age *
              </label>
              <input
                {...register("age", { valueAsNumber: true })}
                type="number"
                id="age"
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter age"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.age.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="contactNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number *
            </label>
            <input
              {...register("contactNo")}
              type="tel"
              id="contactNo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter contact number (required for notifications)"
            />
            {errors.contactNo && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contactNo.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address (optional)"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              {...register("address")}
              id="address"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter patient's address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="caseCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Case Category *
            </label>
            <select
              {...register("caseCategory")}
              id="caseCategory"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a case category</option>
              {Object.entries(caseCategoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.caseCategory && (
              <p className="mt-1 text-sm text-red-600">
                {errors.caseCategory.message}
              </p>
            )}
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
                : initialData
                ? "Update Patient"
                : "Add Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
