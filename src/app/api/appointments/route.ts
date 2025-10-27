import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { appointmentSchema, MAX_PATIENTS_PER_SLOT } from "@/types/appointment";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: {
        appointmentDate: "desc",
      },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    // Check for conflicts - count existing appointments at the same time
    const existingCount = await prisma.appointment.count({
      where: {
        appointmentDate: validatedData.appointmentDate,
        status: {
          not: "CANCELLED",
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

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        status: validatedData.status || "SCHEDULED",
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid appointment data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
