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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const actualSearch = DebounceHook(search);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://placement-pink.vercel.app/api/allStudent");
        setData(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch student data. Please try again later.");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
    const timer = setInterval(fetchStudentData, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filteredData = [...data];
    
    if (actualSearch) {
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
        const pkg = parseFloat(student.package) || 0;
        switch (selectedPackage) {
          case "<5LPA": return pkg < 5;
          case "5-10LPA": return pkg >= 5 && pkg < 10;
          case "10-20LPA": return pkg >= 10 && pkg < 20;
          case "20LPA+": return pkg >= 20;
          default: return true;
        }
      });
    }
    
    setFilterData(filteredData);
  }, [actualSearch, data, selectedBranch, selectedBatch, selectedPackage]);

  const exportCSV = () => {
    try {
      const csv = Papa.unparse(filter);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "students.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting CSV:", err);
      setError("Failed to export data. Please try again.");
    }
  };

  // Safe statistics calculation
  const getBranchStats = () => {
    const branchStats: Record<string, { count: number; avgPackage: number }> = {};
    
    filter.forEach(student => {
      const branch = student.branch || "Unknown";
      const pkg = parseFloat(student.package) || 0;
      
      if (!branchStats[branch]) {
        branchStats[branch] = { count: 0, avgPackage: 0 };
      }
      branchStats[branch].count++;
      branchStats[branch].avgPackage += pkg;
    });

    Object.keys(branchStats).forEach(branch => {
      branchStats[branch].avgPackage = parseFloat(
        (branchStats[branch].avgPackage / branchStats[branch].count).toFixed(2)
      );
    });

    return branchStats;
  };

  const getBatchStats = () => {
    const batchStats: Record<string, { count: number; avgPackage: number }> = {};
    
    filter.forEach(student => {
      const batch = student.batch || "Unknown";
      const pkg = parseFloat(student.package) || 0;
      
      if (!batchStats[batch]) {
        batchStats[batch] = { count: 0, avgPackage: 0 };
      }
      batchStats[batch].count++;
      batchStats[batch].avgPackage += pkg;
    });

    Object.keys(batchStats).forEach(batch => {
      batchStats[batch].avgPackage = parseFloat(
        (batchStats[batch].avgPackage / batchStats[batch].count).toFixed(2)
      );
    });

    return batchStats;
  };

  const getTopCompanies = () => {
    const companyStats: Record<string, number> = {};
    
    filter.forEach(student => {
      const company = student.company || "Unknown";
      companyStats[company] = (companyStats[company] || 0) + 1;
    });

    return Object.entries(companyStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getPackageDistribution = () => {
    const distribution = {
      "<5LPA": 0,
      "5-10LPA": 0,
      "10-20LPA": 0,
      "20LPA+": 0
    };

    filter.forEach(student => {
      const pkg = parseFloat(student.package) || 0;
      if (pkg < 5) distribution["<5LPA"]++;
      else if (pkg < 10) distribution["5-10LPA"]++;
      else if (pkg < 20) distribution["10-20LPA"]++;
      else distribution["20LPA+"]++;
    });

    return distribution;
  };

  // Memoize calculations to prevent unnecessary re-renders
  const uniqueBranches = [...new Set(data.map(student => student.branch || "Unknown").filter(Boolean)];
  const uniqueBatches = [...new Set(data.map(student => student.batch || "Unknown").filter(Boolean)];
  const packageRanges = ["<5LPA", "5-10LPA", "10-20LPA", "20LPA+"];
  const branchStats = getBranchStats();
  const batchStats = getBatchStats();
  const topCompanies = getTopCompanies();
  const packageDistribution = getPackageDistribution();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            disabled={filter.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Data
          </button>
        </div>
      </header>

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

          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Students Card with Package Distribution */}
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
              <div className="mt-2 text-xs opacity-90">
                {Object.entries(packageDistribution).map(([range, count]) => (
                  <div key={range} className="flex justify-between py-1 border-b border-blue-400 border-opacity-30 last:border-0">
                    <span>{range}:</span>
                    <span>
                      {count} ({filter.length > 0 ? ((count / filter.length) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Average Package Card */}
            <div className="bg-green-500 rounded-lg shadow p-4 text-white">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Average Package</p>
                  <h3 className="text-2xl font-bold">
                    {filter.length > 0 
                      ? (filter.reduce((sum, student) => sum + (parseFloat(student.package) || 0, 0) / filter.length).toFixed(2)
                      : "0.00"} LPA
                  </h3>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs opacity-90">
                {Object.entries(batchStats)
                  .sort((a, b) => b[1].avgPackage - a[1].avgPackage)
                  .slice(0, 2)
                  .map(([batch, stats]) => (
                    <div key={batch} className="flex justify-between py-1 border-b border-green-400 border-opacity-30 last:border-0">
                      <span>Batch {batch}:</span>
                      <span>{stats.avgPackage} LPA</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Companies Card */}
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
              <div className="mt-2 text-xs opacity-90">
                {topCompanies.map(([company, count]) => (
                  <div key={company} className="flex justify-between py-1 border-b border-purple-400 border-opacity-30 last:border-0">
                    <span className="truncate max-w-[120px]">{company || "Unknown"}:</span>
                    <span>{count} hires</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Branches Card */}
            <div className="bg-indigo-500 rounded-lg shadow p-4 text-white">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Branches</p>
                  <h3 className="text-2xl font-bold">{Object.keys(branchStats).length}</h3>
                </div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-xs opacity-90">
                {Object.entries(branchStats)
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(0, 2)
                  .map(([branch, stats]) => (
                    <div key={branch} className="flex justify-between py-1 border-b border-indigo-400 border-opacity-30 last:border-0">
                      <span className="truncate max-w-[120px]">{branch}:</span>
                      <span>{stats.count} ({stats.avgPackage} LPA)</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Detailed Analysis Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Branch Analysis */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Branch Analysis
                </h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {Object.entries(branchStats)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([branch, stats]) => (
                    <div key={branch} className="px-4 py-3 hover:bg-blue-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{branch || "Unknown"}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {stats.count} students
                          </span>
                          <span className="font-semibold">
                            {stats.avgPackage} LPA
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${filter.length > 0 ? (stats.count / filter.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Batch Analysis */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Batch Analysis
                </h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {Object.entries(batchStats)
                  .sort((a, b) => b[1].avgPackage - a[1].avgPackage)
                  .map(([batch, stats]) => (
                    <div key={batch} className="px-4 py-3 hover:bg-green-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Batch {batch || "Unknown"}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {stats.count} placed
                          </span>
                          <span className="font-semibold">
                            {stats.avgPackage} LPA
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${filter.length > 0 ? (stats.count / filter.length) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Company Analysis */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
                <h2 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Company Analysis
                </h2>
              </div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {topCompanies.map(([company, count], index) => (
                  <div key={company} className="px-4 py-3 hover:bg-purple-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-800 font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{company || "Unknown Company"}</h3>
                        <p className="text-sm text-gray-500">{count} placement{count !== 1 ? 's' : ''}</p>
                      </div>
                      <span className="text-sm bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                        {filter.length > 0 ? ((count / filter.length) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Student Cards */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {filter.length} Student{filter.length !== 1 ? 's' : ''} Found
              </h2>
              {filter.length > 0 && (
                <span className="text-sm text-gray-500">
                  Showing {Math.min(filter.length, 12)} of {filter.length}
                </span>
              )}
            </div>
            {filter.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filter.slice(0, 12).map((student) => (
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
