"use client";

import { useState, useEffect } from "react";
import PatientForm from "@/components/forms/patient-form";
import PatientTable from "@/components/tables/patient-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientFormData } from "@/types/patient";
import { ArrowLeft, User } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  address?: string;
  caseCategory: string;
  contactNo: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = "list" | "form" | "view";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle form submission
  const handleSubmit = async (data: PatientFormData) => {
    try {
      setIsSubmitting(true);
      const url = selectedPatient
        ? `/api/patients/${selectedPatient.id}`
        : "/api/patients";
      const method = selectedPatient ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchPatients(); // Refresh the list
        setViewMode("list");
        setSelectedPatient(null);
      } else {
        const error = await response.json();
        console.error("Failed to save patient:", error);
        alert("Failed to save patient. Please try again.");
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode("form");
  };

  // Handle view
  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode("view");
  };

  // Handle delete
  const handleDelete = async (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPatients(); // Refresh the list
      } else {
        console.error("Failed to delete patient");
        alert("Failed to delete patient. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle add new
  const handleAddNew = () => {
    setSelectedPatient(null);
    setViewMode("form");
  };

  // Handle cancel
  const handleCancel = () => {
    setViewMode("list");
    setSelectedPatient(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {viewMode !== "list" && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-8 w-8" />
              Patient Management
            </h1>
            <p className="text-gray-600">
              {viewMode === "list" &&
                "Manage your patient records and information"}
              {viewMode === "form" &&
                (selectedPatient
                  ? "Edit patient information"
                  : "Add a new patient to the system")}
              {viewMode === "view" && "View patient details"}
            </p>
          </div>
        </div>
      </div>

      {viewMode === "list" && (
        <PatientTable
          patients={patients}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onAddNew={handleAddNew}
          isLoading={loading}
        />
      )}

      {viewMode === "form" && (
        <PatientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={
            selectedPatient
              ? {
                  name: selectedPatient.name,
                  age: selectedPatient.age,
                  address: selectedPatient.address || undefined,
                  caseCategory: selectedPatient.caseCategory as
                    | "HAIR"
                    | "SKIN"
                    | "MOLES"
                    | "HAIR_REMOVAL"
                    | "HYDRAFACIAL"
                    | "WEIGHT_LOSS"
                    | "OTHER",
                  contactNo: selectedPatient.contactNo,
                }
              : undefined
          }
          isLoading={isSubmitting}
        />
      )}

      {viewMode === "view" && selectedPatient && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Details
            </CardTitle>
            <CardDescription>
              Complete information for {selectedPatient.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedPatient.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Age</label>
                <p className="text-lg text-gray-900">
                  {selectedPatient.age} years
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <p className="text-lg text-gray-900">
                  {selectedPatient.contactNo}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Case Category
                </label>
                <p className="text-lg text-gray-900">
                  {selectedPatient.caseCategory}
                </p>
              </div>
            </div>
            {selectedPatient.address && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="text-lg text-gray-900">
                  {selectedPatient.address}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Close
              </Button>
              <Button onClick={() => handleEdit(selectedPatient)}>
                Edit Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
