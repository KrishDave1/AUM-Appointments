import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { doctorSchema } from "@/types/doctor";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor" },
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
    const validatedData = doctorSchema.parse(body);

    const doctor = await prisma.doctor.update({
      where: { id },
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

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error updating doctor:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid doctor data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update doctor" },
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
    await prisma.doctor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
