import "dotenv/config";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error("❌ Twilio credentials missing. Check your .env file.");
}

const client = twilio(accountSid, authToken);

export async function sendSMS(body: string, phone: string) {
  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER!}`,
      to: `whatsapp:${phone.startsWith("+") ? phone : `+91${phone}`}`, // ensure E.164 format
      body,
    });
  } catch (error) {
    console.error("❌ SMS failed:", error);
    throw error;
  }
}