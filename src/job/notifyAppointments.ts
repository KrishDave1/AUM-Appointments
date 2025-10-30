import "dotenv/config";
import cron from "node-cron";
import { sendSMS } from "../lib/sms.js";
import { getTodaysAppointments } from "../lib/db.js";

const VERIFIED_NUMBERS = ["9979872572", "9624517000"];

async function notifyAppointments() {
  console.log("📅 Checking today's appointments...");

  const appointments = await getTodaysAppointments();

  if (appointments.length === 0) {
    console.log("📭 No appointments today.");
    return;
  }

  for (const appointment of appointments) {
    const message = `🏥 *Aum Skin Hair Laser Clinic*

👩 *Appointment Reminder:*
Doctor: ${appointment.doctor?.name ?? "N/A"}
Patient: ${appointment.patient?.name ?? "N/A"}
Contact No: ${appointment.patient?.contactNo ?? "N/A"}
Case Category: ${appointment.patient?.caseCategory ?? "N/A"}
Date: *${appointment.appointmentDate.toLocaleString()}*
Case Description: ${appointment.caseDescription ?? "N/A"}

Please arrive 10 minutes early.`;

    for (const number of VERIFIED_NUMBERS) {
      try {
        await sendSMS(message, number);
        console.log(`✅ Reminder sent to ${number} for ${appointment.patient?.name}`);
      } catch (error) {
        console.error(`❌ Failed to send reminder to ${number}:`, error);
      }
    }
  }
}

// ⏰ Run every day at 8 AM
cron.schedule("* * * * *", () => {
  console.log("📅 Appointment notifier started ... running daily at 8 AM");
  notifyAppointments();
});
