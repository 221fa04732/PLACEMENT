"use client"

import { useState } from "react";
import axios from "axios"


export default function Home() {

  const [studentData, setStudentData] = useState<File | null>(null)
  const [selectedFile, setSelectedFile] = useState("");
  const [message, setmessage] = useState<string>("choose a file")

  async function fetchStudentData(){

    try{
      if(studentData){

        const formdata = new FormData();
        formdata.append("file", studentData);

        console.log(formdata)
        const response =await axios.post("http://localhost:3000/api/newStudent",formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
        }})
        setmessage(response.data.message + " : " +response.data.user.count)
      }
      else{
        setmessage("choose a file")
      }
    }

    catch(error){
      setmessage("An errror occured")
      console.error(error)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-red-500 text-lg mb-4">{message}</div>
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-96 text-center border border-white/20">
            <h2 className="text-3xl font-extrabold text-gray-200 mb-4">Upload CSV File</h2>
            <p className="text-lg text-gray-400 mb-6">Select and upload a CSV file</p>
            <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-6 rounded-lg hover:opacity-90 transition duration-300 inline-block">
                Select File
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            setStudentData(file);
                            setSelectedFile(file.name);
                        }
                    }}
                    className="hidden"
                />
            </label>
            {selectedFile && (
                <p className="mt-4 text-sm text-red-600">Selected: {selectedFile}</p>
            )}
            <button 
                onClick={fetchStudentData}
                className="mt-5 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition duration-300">
                Upload File
            </button>
        </div>
    </div>
);
}
