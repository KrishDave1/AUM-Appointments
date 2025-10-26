import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Search, Plus } from "lucide-react";
import { caseCategoryLabels } from "@/types/patient";

interface Patient {
  id: string;
  name: string;
  age: number;
  address?: string;
  caseCategory: string;
  contactNo: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
  onView: (patient: Patient) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

export default function PatientTable({
  patients,
  onEdit,
  onDelete,
  onView,
  onAddNew,
  isLoading = false,
}: PatientTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contactNo.includes(searchTerm) ||
      patient.caseCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>Loading patients...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Patients ({filteredPatients.length})</CardTitle>
            <CardDescription>Manage your patient records</CardDescription>
          </div>
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "No patients found matching your search."
                : "No patients found."}
            </p>
            {!searchTerm && (
              <Button onClick={onAddNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Patient
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Age
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Case Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Address
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {patient.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{patient.age}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {patient.contactNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {
                          caseCategoryLabels[
                            patient.caseCategory as keyof typeof caseCategoryLabels
                          ]
                        }
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {patient.address || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(patient)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(patient)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(patient.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

