import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Home, Settings, LogOut, Bell } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold">AUM Appointments</h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link href="/appointments">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </Button>
        </Link>

        <Link href="/patients">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
          >
            <Users className="mr-2 h-4 w-4" />
            Patients
          </Button>
        </Link>

        <Link href="/notifications">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </Link>

        <Link href="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-gray-800"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="border-t border-gray-700 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
