import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { doctorSchema } from "@/types/doctor";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = doctorSchema.parse(body);

    // Check if doctor with this email already exists (only if email is provided)
    if (validatedData.email && validatedData.email !== "") {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { email: validatedData.email },
      });

      if (existingDoctor) {
        return NextResponse.json(
          { error: "Doctor with this email already exists" },
          { status: 409 }
        );
      }
    }

    // Check if doctor with this phone already exists
    const existingDoctorByPhone = await prisma.doctor.findFirst({
      where: { phone: validatedData.phone },
    });

    if (existingDoctorByPhone) {
      return NextResponse.json(
        { error: "Doctor with this phone number already exists" },
        { status: 409 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        name: validatedData.name,
        email:
          validatedData.email && validatedData.email !== ""
            ? validatedData.email
            : null,
        phone: validatedData.phone,
        specialization: validatedData.specialization || [],
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("Error creating doctor:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid doctor data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create doctor" },
      { status: 500 }
    );
  }
}
