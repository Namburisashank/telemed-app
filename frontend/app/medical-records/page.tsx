"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MedicalRecords() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📂 Medical Records</h1>
      
      {/* Upload Box */}
      <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-10 text-center">
        <p className="text-gray-600 mb-4">Upload your medical reports (PDF, JPG, PNG)</p>
        <input 
          type="file" 
          accept=".pdf, .jpg, .png" 
          multiple
          onChange={handleFileChange}
          className="hidden" 
          id="fileUpload"
        />
        <label 
          htmlFor="fileUpload" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
        >
          Select Files
        </label>
      </div>

      {/* List of Files */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Uploaded Documents</h3>
        {files.length === 0 ? (
          <p className="text-gray-500">No records uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center bg-white p-3 border rounded shadow-sm">
                <span className="text-gray-800 flex items-center gap-2">
                  📄 {file.name} <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(0)} KB)</span>
                </span>
                <button className="text-red-500 text-sm hover:underline">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => router.push('/dashboard')} className="mt-10 text-gray-500 hover:text-black">
        ← Back to Dashboard
      </button>
    </div>
  );
}