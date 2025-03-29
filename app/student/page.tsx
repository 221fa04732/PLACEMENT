"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import StudentCard from "../component/StudentCard";
import Footer from "../component/Footer";
import DebounceHook from "../hooks/Debounce";

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
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const actualSearch = DebounceHook(search);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("https://placement-pink.vercel.app/api/allStudent");
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
    let filteredData = data;
    
    if (actualSearch !== "") {
      filteredData = filteredData.filter((student) =>
        Object.values(student).some((value) =>
          String(value).toLowerCase().includes(actualSearch.toLowerCase())
        )
      );
    }
    
    if (selectedBranch) {
      filteredData = filteredData.filter(student => student.branch === selectedBranch);
    }
    
    if (selectedBatch) {
      filteredData = filteredData.filter(student => student.batch === selectedBatch);
    }
    
    if (selectedPackage) {
      filteredData = filteredData.filter(student => {
        const pkg = parseFloat(student.package);
        switch (selectedPackage) {
          case "<5LPA":
            return pkg < 5;
          case "5-10LPA":
            return pkg >= 5 && pkg < 10;
          case "10-20LPA":
            return pkg >= 10 && pkg < 20;
          case "20LPA+":
            return pkg >= 20;
          default:
            return true;
        }
      });
    }
    
    setFilterData(filteredData);
  }, [actualSearch, data, selectedBranch, selectedBatch, selectedPackage]);

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

  const getBranchStats = () => {
    const branchStats: Record<string, { count: number; avgPackage: number }> = {};
    
    filter.forEach(student => {
      if (!branchStats[student.branch]) {
        branchStats[student.branch] = { count: 0, avgPackage: 0 };
      }
      branchStats[student.branch].count++;
      branchStats[student.branch].avgPackage += parseFloat(student.package);
    });

    Object.keys(branchStats).forEach(branch => {
      branchStats[branch].avgPackage = parseFloat((branchStats[branch].avgPackage / branchStats[branch].count).toFixed(2));
    });

    return branchStats;
  };

  const getBatchStats = () => {
    const batchStats: Record<string, { count: number; avgPackage: number }> = {};
    
    filter.forEach(student => {
      if (!batchStats[student.batch]) {
        batchStats[student.batch] = { count: 0, avgPackage: 0 };
      }
      batchStats[student.batch].count++;
      batchStats[student.batch].avgPackage += parseFloat(student.package);
    });

    Object.keys(batchStats).forEach(batch => {
      batchStats[batch].avgPackage = parseFloat((batchStats[batch].avgPackage / batchStats[batch].count).toFixed(2));
    });

    return batchStats;
  };

  const getTopCompanies = () => {
    const companyStats: Record<string, number> = {};
    
    filter.forEach(student => {
      companyStats[student.company] = (companyStats[student.company] || 0) + 1;
    });

    return Object.entries(companyStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const uniqueBranches = [...new Set(data.map(student => student.branch))];
  const uniqueBatches = [...new Set(data.map(student => student.batch))];
  const packageRanges = ["<5LPA", "5-10LPA", "10-20LPA", "20LPA+"];
  const branchStats = getBranchStats();
  const batchStats = getBatchStats();
  const topCompanies = getTopCompanies();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full fixed top-0 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-center z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            Student Placement Portal
          </h1>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Data
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    id="branch-filter"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="">All Branches</option>
                    {uniqueBranches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="batch-filter" className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <select
                    id="batch-filter"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                  >
                    <option value="">All Batches</option>
                    {uniqueBatches.map((batch) => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="package-filter" className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                  <select
                    id="package-filter"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                  >
                    <option value="">All Packages</option>
                    {packageRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 rounded-lg shadow p-4 text-white">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Total Students</p>
                  <h3 className="text-2xl font-bold">{filter.length}</h3>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-green-500 rounded-lg shadow p-4 text-white">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Average Package</p>
                  <h3 className="text-2xl font-bold">
                    {filter.length > 0 
                      ? (filter.reduce((sum, student) => sum + parseFloat(student.package), 0) / filter.length).toFixed(2)
                      : "0.00"} LPA
                  </h3>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-purple-500 rounded-lg shadow p-4 text-white">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Top Companies</p>
                  <h3 className="text-2xl font-bold">{topCompanies.length}</h3>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Student Cards */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {filter.length} Student{filter.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            {filter.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filter.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-1">No students found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPage;