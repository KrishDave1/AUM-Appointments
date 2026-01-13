"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { statusLabels, statusColors } from "@/types/appointment";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  caseDescription?: string;
  appointmentDate: string;
  status: string;
  doctor: { name: string };
  patient: { name: string; contactNo: string; caseCategory: string };
}

export default function NotificationsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/appointments"); // Gets all appointments
      if (response.ok) {
        const allAppointments: Appointment[] = await response.json();
        
        // Client-side filter for selected date (normalized to start of day)
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const dailyAppointments = allAppointments.filter((appt) => {
          const apptDate = new Date(appt.appointmentDate);
          return apptDate >= startOfDay && apptDate <= endOfDay;
        });

        // Sort by time
        dailyAppointments.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());

        setAppointments(dailyAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <CalendarIcon className="h-8 w-8" />
          Notification History
        </h1>
        <p className="text-gray-600">
          View appointments sent for notification by date
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
           <div className="flex items-center justify-between">
            <CardTitle>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardTitle>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => setSelectedDate(new Date())}>Today</Button>
                <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
           </div>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No appointments found for this date.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b text-left text-sm font-medium text-gray-500">
                                <th className="py-3 px-4">Time</th>
                                <th className="py-3 px-4">Patient</th>
                                <th className="py-3 px-4">Contact</th>
                                <th className="py-3 px-4">Doctor</th>
                                <th className="py-3 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt) => (
                                <tr key={appt.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">
                                        {new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-900">
                                        {appt.patient.name}
                                        <div className="text-xs text-gray-500 font-normal">{appt.patient.caseCategory}</div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{appt.patient.contactNo}</td>
                                    <td className="py-3 px-4 text-gray-600">{appt.doctor.name}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[appt.status as keyof typeof statusColors]}`}>
                                            {statusLabels[appt.status as keyof typeof statusLabels]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
        <strong>Note:</strong> This list represents appointments scheduled for the selected date. The daily notification cron job sends SMS reminders for these appointments at 8:00 AM on the day prior.
      </div>
    </div>
  );
}
