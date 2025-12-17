"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BookAppointment() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Fetch doctors when page loads
    axios.get("http://localhost:5000/api/appointments/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) return alert("Please login first");

    try {
      await axios.post("http://localhost:5000/api/appointments/book", {
        patientId: user.id,
        doctorId: selectedDoctor,
        date: date
      });
      alert("Booking Confirmed!");
      router.push("/dashboard"); // Go back to dashboard
    } catch (err) {
      console.error(err);
      alert("Booking Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Book an Appointment 📅</h1>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        {/* Select Doctor */}
        <label className="block mb-2 font-bold text-gray-700">Choose Doctor</label>
        <select 
          className="w-full p-2 border rounded mb-4 text-black"
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">-- Select a Doctor --</option>
          {doctors.map((doc: any) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.full_name}
            </option>
          ))}
        </select>

        {/* Select Date */}
        <label className="block mb-2 font-bold text-gray-700">Select Date</label>
        <input 
          type="date" 
          className="w-full p-2 border rounded mb-6 text-black"
          onChange={(e) => setDate(e.target.value)}
        />

        <button 
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}