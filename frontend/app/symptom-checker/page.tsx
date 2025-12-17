"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SymptomChecker() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    { role: "bot", text: "Hello! I am your AI Health Assistant. Describe your symptoms, and I will suggest which doctor to visit." }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // 2. Call Backend API
      const res = await axios.post("http://localhost:5000/api/ai/analyze", {
        symptoms: userMessage.text
      });

      // 3. Add AI Response
      const botMessage = { role: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I am having trouble connecting. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 sm:mx-[10%] mt-10 mb-20">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-600">AI Symptom Checker 🤖</h1>
        <p className="text-gray-500 mt-2">Describe your health concern, and let AI guide you.</p>
      </div>

      {/* Chat Box */}
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col h-[500px]">
        
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg text-sm leading-6 ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm"
                }`}
              >
                 {msg.role === "bot" && <span className="block font-bold mb-1 text-blue-600">TeleMed AI:</span>}
                 {msg.text.split('\n').map((line:string, i:number) => (
                    <span key={i} className="block">{line}</span>
                 ))}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                    <p className="text-gray-500 text-sm animate-pulse">Analyzing symptoms...</p>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
             placeholder="e.g., I have a bad headache and fever..."
             className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
           />
           <button 
             onClick={handleSend}
             disabled={loading}
             className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50"
           >
             Send
           </button>
        </div>
      </div>

      {/* Quick Action */}
      <div className="text-center mt-8">
        <button onClick={() => router.push('/doctors')} className="text-blue-600 font-medium hover:underline">
            Skip and browse all doctors &rarr;
        </button>
      </div>

    </div>
  );
}