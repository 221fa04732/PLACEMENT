"use client"

import { Briefcase, Calendar, Building, GraduationCap, Hash, Package, User } from "lucide-react";
import Button from "./Button";

interface Student {
  id: string;
  name: string;
  regNo: string;
  batch: string;
  company: string;
  package: string;
  branch: string;
  placedDate: string;
}

export default function StudentCard({ student }: { student: Student }) {
  
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="absolute left-4 top-6 w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="ml-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700"><span className="font-medium">Reg No:</span> {student.regNo}</p>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700"><span className="font-medium">Batch:</span> {student.batch}</p>
          </div>
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700"><span className="font-medium">Company:</span> {student.company}</p>
          </div>
          <div className="flex items-center gap-3">
            <Package className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700"><span className="font-medium">Package:</span> {student.package} LPA</p>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700"><span className="font-medium">Branch:</span> {student.branch}</p>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700"><span className="font-medium">Placed Date:</span> {student.placedDate}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button id={student.id} />
        </div>
      </div>
    </div>
  );
}