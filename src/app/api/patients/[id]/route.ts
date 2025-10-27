import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { patientSchema } from "@/types/patient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient" },
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
    const validatedData = patientSchema.parse(body);

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...validatedData,
        email:
          validatedData.email && validatedData.email !== ""
            ? validatedData.email
            : null,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error updating patient:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid patient data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update patient" },
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
    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  }
}
