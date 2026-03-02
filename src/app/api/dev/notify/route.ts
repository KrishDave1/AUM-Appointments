import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/sms";
import { getTomorrowsAppointments } from "@/lib/db";

export const dynamic = "force-dynamic";

const VERIFIED_NUMBERS = ["9979872572", "9427611557"];

export async function GET(request: Request) {
  try {
    console.log("📅 [DEV] Checking appointments for tomorrow...");
    const appointments = await getTomorrowsAppointments();

    if (appointments.length === 0) {
      console.log("📭 [DEV] No appointments for tomorrow.");
      return NextResponse.json({ message: "No appointments for tomorrow" });
    }

    const results = [];

    // Send individual messages so doctors can forward them
    for (const appt of appointments) {
      const dateStr = appt.appointmentDate.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      const message = `🏥 *Aum Skin Hair Laser Clinic*

👩 *Appointment Reminder:*
Doctor: ${appt.doctor?.name || "N/A"}
Patient: ${appt.patient?.name || "N/A"}
Patient Contact No: ${appt.patient?.contactNo || "N/A"}
Case Category: ${appt.patient?.caseCategory || "N/A"}
Date: *${dateStr}*
Case Description: ${appt.caseDescription || "N/A"}

Please arrive 10 minutes early.`;

      for (const number of VERIFIED_NUMBERS) {
        try {
          await sendSMS(message, number);
          console.log(
            `✅ [DEV] Message sent to ${number} for ${appt.patient?.name}`,
          );
          results.push({ number, status: "sent", patient: appt.patient?.name });
        } catch (error) {
          console.error(`❌ [DEV] Failed to send to ${number}:`, error);
          results.push({ number, status: "failed", error: String(error) });
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("[DEV] API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 },
    );
  }
}
