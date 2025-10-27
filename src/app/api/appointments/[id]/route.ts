import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { appointmentSchema, MAX_PATIENTS_PER_SLOT } from "@/types/appointment";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    // Check for conflicts when updating appointment time
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    const currentDateStr = currentAppointment?.appointmentDate.toISOString();
    const newDateStr = new Date(validatedData.appointmentDate).toISOString();

    if (currentDateStr !== newDateStr) {
      const existingCount = await prisma.appointment.count({
        where: {
          appointmentDate: new Date(validatedData.appointmentDate),
          status: {
            not: "CANCELLED",
          },
          NOT: {
            id: id, // Exclude current appointment
          },
        },
      });

      if (existingCount >= MAX_PATIENTS_PER_SLOT) {
        return NextResponse.json(
          {
            error: "Time slot is full",
            message: `Maximum ${MAX_PATIENTS_PER_SLOT} patients can be scheduled at the same time`,
          },
          { status: 409 }
        );
      }
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: validatedData,
      include: {
        patient: true,
        doctor: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid appointment data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
