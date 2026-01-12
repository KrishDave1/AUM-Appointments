import { NextResponse } from 'next/server';
import { sendSMS } from "@/lib/sms";
import { getTodaysAppointments } from "@/lib/db";

// Ensure this route is not statically cached
export const dynamic = 'force-dynamic';

const VERIFIED_NUMBERS = ["9979872572", "9427611557"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Simple security check using a secret token
    if (token !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("📅 Checking today's appointments...");

    const appointments = await getTodaysAppointments();

    if (appointments.length === 0) {
      console.log("📭 No appointments today.");
      return NextResponse.json({ message: 'No appointments today' });
    }

    const results = [];

    for (const appointment of appointments) {
      const message = `🏥 *Aum Skin Hair Laser Clinic*

👩 *Appointment Reminder:*
Doctor: ${appointment.doctor?.name ?? "N/A"}
Patient: ${appointment.patient?.name ?? "N/A"}
Contact No: ${appointment.patient?.contactNo ?? "N/A"}
Case Category: ${appointment.patient?.caseCategory ?? "N/A"}
Date: *${appointment.appointmentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}*
Case Description: ${appointment.caseDescription ?? "N/A"}

Please arrive 10 minutes early.`;

      for (const number of VERIFIED_NUMBERS) {
        try {
          await sendSMS(message, number);
          console.log(`✅ Reminder sent to ${number} for ${appointment.patient?.name}`);
          results.push({ number, status: 'sent', patient: appointment.patient?.name });
        } catch (error) {
          console.error(`❌ Failed to send reminder to ${number}:`, error);
          results.push({ number, status: 'failed', error: String(error) });
        }
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
