import { NextResponse } from "next/server";
import { notifyAppointments } from "@/job/notifyAppointments";

export async function GET() {
    try {
        console.log("📅 Manual cron trigger started...");
        await notifyAppointments(); 
        return NextResponse.json({ status: "ok", message: "Reminders sent" });
    } catch (err) {
        console.error("❌ Cron trigger failed:", err);
        return NextResponse.json({ status: "error", message: (err as Error).message }, { status: 500 });
    }
}