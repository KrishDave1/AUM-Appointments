import { NextResponse } from 'next/server';
import { sendSMS } from "@/lib/sms";
import { getTomorrowsAppointments } from "@/lib/db";

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

    console.log("📅 Checking appointments for tomorrow...");

    const appointments = await getTomorrowsAppointments();

    if (appointments.length === 0) {
      console.log("📭 No appointments for tomorrow.");
      return NextResponse.json({ message: 'No appointments for tomorrow' });
    }

    // Group appointments by Doctor
    const appointmentsByDoctor: Record<string, typeof appointments> = {};
    
    for (const appt of appointments) {
      const docName = appt.doctor?.name || "Unknown Doctor";
      if (!appointmentsByDoctor[docName]) {
        appointmentsByDoctor[docName] = [];
      }
      appointmentsByDoctor[docName].push(appt);
    }

    // specific date for header
    const dateString = appointments[0].appointmentDate.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      timeZone: 'Asia/Kolkata'
    });

    let message = `🏥 *Daily Digest for ${dateString}*\n\n`;

    // Build the digest message
    for (const [docName, docAppts] of Object.entries(appointmentsByDoctor)) {
      message += `👨‍⚕️ *${docName}* (${docAppts.length})\n`;
      
      for (const appt of docAppts) {
        const time = appt.appointmentDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata'
        });
        const patName = appt.patient?.name || "Unknown";
        const category = appt.patient?.caseCategory || "-";
        const contact = appt.patient?.contactNo || "";
        
        message += `• ${time} - ${patName} (${category}) ${contact}\n`;
      }
      message += `\n`;
    }

    message += `Total: ${appointments.length} appointments`;

    const results = [];
    
    console.log("📝 Sending Daily Digest:\n", message);

    for (const number of VERIFIED_NUMBERS) {
      try {
        await sendSMS(message, number);
        console.log(`✅ Digest sent to ${number}`);
        results.push({ number, status: 'sent' });
      } catch (error) {
        console.error(`❌ Failed to send digest to ${number}:`, error);
        results.push({ number, status: 'failed', error: String(error) });
      }
    }

    return NextResponse.json({ success: true, results, digest: message });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
