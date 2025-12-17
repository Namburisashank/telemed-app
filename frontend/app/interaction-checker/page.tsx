"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function InteractionChecker() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(""); // Clear previous result

    try {
      const res = await axios.post("http://localhost:5000/api/ai/check-interaction", {
        medicines: input
      });
      setResult(res.data.reply);
    } catch (error) {
      setResult("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 sm:mx-[10%] mt-10 mb-20">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-red-500">💊 Medicine Interaction Checker</h1>
        <p className="text-gray-500 mt-2">Enter two or more medicines to check if they are safe together.</p>
      </div>

      {/* Main Card */}
      <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        
        <label className="block text-gray-700 font-medium mb-2">Enter Medicine Names (separated by comma):</label>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Aspirin, Warfarin"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
        />

        <button 
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-red-500 text-white font-bold py-3 rounded-lg mt-6 hover:bg-red-600 transition disabled:opacity-50"
        >
          {loading ? "Checking Safety..." : "Check Interactions"}
        </button>

        {/* Result Area */}
        {result && (
          <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg">
            <h3 className="font-bold text-red-700 mb-2">Analysis Result:</h3>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
              {result}
            </p>
          </div>
        )}

      </div>

      <button onClick={() => router.push('/dashboard')} className="block mx-auto mt-10 text-gray-500 hover:text-black">
        ← Back to Dashboard
      </button>

    </div>
  );
}