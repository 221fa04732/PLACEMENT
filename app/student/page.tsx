"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import StudentCard from "../component/StudentCard";
import Footer from "../component/Footer";
import DebounceHook from "../hooks/Debounce";

// Define student data type
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

const StudentPage = () => {
  const [data, setData] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilterData] = useState<Student[]>([]);
  const actualSearch = DebounceHook(search);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("https://placement-silk.vercel.app/api/allStudent");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentData();
    const timer = setInterval(fetchStudentData, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (actualSearch !== "") {
      const temp = data.filter((student) =>
        Object.values(student).some((value) =>
          String(value).toLowerCase().includes(actualSearch.toLowerCase())
        )
      );
      setFilterData(temp);
    } else {
      setFilterData(data);
    }
  }, [actualSearch, data]);

  const exportCSV = () => {
    const csv = Papa.unparse(filter);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="w-full fixed top-0 h-16 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm flex items-center justify-center z-50">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Student Information
        </h1>
      </div>

      <div className="flex items-center justify-center mt-24 px-4 gap-3 sm:gap-4">
        <input
          type="text"
          className="border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none h-12 p-3 w-full sm:w-2/3 lg:w-1/2 rounded-md shadow-sm text-gray-700"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={exportCSV}
          className="bg-blue-600 text-white px-5 py-3 rounded-md shadow-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base"
        >
          Export CSV
        </button>
      </div>

      <div className="container mx-auto px-4 mb-12 mt-10 min-h-screen">
        {filter.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filter.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-96 text-gray-500 text-xl">
            No Data Available
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StudentPage;