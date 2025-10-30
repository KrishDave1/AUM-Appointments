import { prisma } from "@/lib/db";
import { sendSMS } from "@/lib/sms";

async function notifyAppointments() {
  console.log("📅 Checking upcoming appointments...");

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  // Fetch appointments scheduled within the next 24 hours
  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDate: {
        gte: now,
        lt: tomorrow,
      },
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (appointments.length === 0) {
    console.log("No appointments in the next 24 hours.");
    return;
  }

  for (const appt of appointments) {
    const message = `🏥 AUM Skin Hair Laser Clinic

👩‍⚕️ Appointment Reminder:
Doctor: ${appt.doctor.name}
Date: ${appt.appointmentDate.toLocaleString()}
Case: ${appt.caseDescription ?? "N/A"}

Please arrive 10 minutes early.`;

    try {
      await sendSMS(message, appt.patient.contactNo);
      console.log(`✅ Reminder sent to ${appt.patient.contactNo}`);
    } catch (error) {
      console.error(`❌ Failed to send reminder to ${appt.patient.contactNo}:`, error);
    }
  }
}

notifyAppointments().finally(() => process.exit());
