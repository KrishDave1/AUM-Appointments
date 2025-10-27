"use client";

import { useState, useEffect } from "react";
import AppointmentForm from "@/components/forms/appointment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AppointmentFormData,
  statusLabels,
  statusColors,
} from "@/types/appointment";
import { caseCategoryLabels } from "@/types/patient";
import {
  ArrowLeft,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserPlus,
} from "lucide-react";
import DoctorModal from "@/components/modals/doctor-modal";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  caseDescription?: string;
  appointmentDate: string;
  status: string;
  charge?: number;
  doctor: { name: string };
  patient: { name: string; caseCategory: string };
}

interface Patient {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  name: string;
}

type ViewMode = "list" | "form" | "view";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointments");
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.caseDescription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle form submission
  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      const url = selectedAppointment?.id
        ? `/api/appointments/${selectedAppointment.id}`
        : "/api/appointments";
      const method = selectedAppointment?.id ? "PUT" : "POST";

      // Convert datetime-local to ISO string
      const appointmentData = {
        ...data,
        appointmentDate: new Date(data.appointmentDate).toISOString(),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        await fetchAppointments();
        setViewMode("list");
        setSelectedAppointment(null);
      } else {
        const error = await response.json();
        console.error("Failed to save appointment:", error);
        alert(error.message || "Failed to save appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewMode("form");
  };

  const handleDelete = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAppointments();
      } else {
        alert("Failed to delete appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAddNew = () => {
    setSelectedAppointment(null);
    setViewMode("form");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedAppointment(null);
  };

  const handleDoctorCreated = () => {
    fetchDoctors(); // Refresh doctor list
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
              <Calendar className="h-8 w-8" />
              Appointments
            </h1>
            <p className="text-gray-600">
              {viewMode === "list" && "Manage your appointments schedule"}
              {viewMode === "form" &&
                (selectedAppointment
                  ? "Edit appointment details"
                  : "Schedule a new appointment")}
              {viewMode === "view" && "View appointment details"}
            </p>
          </div>
        </div>
      </div>

      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  Appointments ({filteredAppointments.length})
                </CardTitle>
                <CardDescription>
                  Manage your appointments schedule
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowDoctorModal(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Doctor
                </Button>
                <Button
                  onClick={handleAddNew}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Appointment
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No appointments found.</p>
                {!searchTerm && !filterStatus && (
                  <Button
                    onClick={handleAddNew}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule Your First Appointment
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Case Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Doctor
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Date & Time
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Charge
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {appointment.patient.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {
                              caseCategoryLabels[
                                appointment.patient
                                  .caseCategory as keyof typeof caseCategoryLabels
                              ]
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {appointment.doctor.name}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[
                                appointment.status as keyof typeof statusColors
                              ]
                            }`}
                          >
                            {
                              statusLabels[
                                appointment.status as keyof typeof statusLabels
                              ]
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {appointment.charge ? `₹${appointment.charge}` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(appointment)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(appointment.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "form" && (
        <AppointmentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={
            selectedAppointment
              ? {
                  id: selectedAppointment.id,
                  doctorId: selectedAppointment.doctorId,
                  patientId: selectedAppointment.patientId,
                  caseDescription:
                    selectedAppointment.caseDescription || undefined,
                  appointmentDate: new Date(
                    selectedAppointment.appointmentDate
                  ).toISOString(),
                  status: selectedAppointment.status as
                    | "SCHEDULED"
                    | "COMPLETED"
                    | "CANCELLED"
                    | "NO_SHOW",
                  charge: selectedAppointment.charge || undefined,
                }
              : undefined
          }
          isLoading={isSubmitting}
          patients={patients}
          doctors={doctors}
        />
      )}

      {showDoctorModal && (
        <DoctorModal
          onClose={() => setShowDoctorModal(false)}
          onSuccess={handleDoctorCreated}
        />
      )}
    </div>
  );
}
