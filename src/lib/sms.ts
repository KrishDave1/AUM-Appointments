import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

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