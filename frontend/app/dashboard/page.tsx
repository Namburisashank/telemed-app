"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- 1. The Doctor Catalog ---
const doctorsData = [
  {
    id: 3,
    name: "Dr. Richard James",
    speciality: "General physician",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Dr. Emily Larson",
    speciality: "Gynecologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Dr. Christopher Lee",
    speciality: "Pediatricians",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    name: "Dr. Jennifer Garcia",
    speciality: "Neurologist",
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "Dr. Andrew Williams",
    speciality: "Gastroenterologist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 9,
    name: "Dr. Christopher Davis",
    speciality: "General physician",
    image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5473?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    name: "Dr. Timothy White",
    speciality: "Gynecologist",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    name: "Dr. Ava Mitchell",
    speciality: "Dermatologist",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    name: "Dr. Jeffrey King",
    speciality: "Pediatricians",
    image: "https://images.unsplash.com/photo-1637059824899-a441006a566e?auto=format&fit=crop&q=80&w=800"
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAppointments(parsedUser.id);
    }
  }, []);

  const fetchAppointments = (userId: any) => {
    axios.get(`http://localhost:5000/api/appointments/my-appointments/${userId}`)
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleCancel = async (id: number) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/cancel/${id}`);
        alert("Appointment Cancelled");
        if (user) fetchAppointments(user.id);
      } catch (err) {
        alert("Failed to cancel");
      }
    }
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header Bar */}
      <div className="bg-blue-600 text-white px-10 py-4 flex justify-between items-center shadow-md">
         <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">TeleMed 🏥</h1>
         </div>
         <div className="flex items-center gap-4">
            <p>Welcome, {user.full_name}</p>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm font-medium transition">
                Logout
            </button>
         </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 p-6">
        
        {/* --- ACTION BUTTONS (5 Items Grid) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
            
            {/* 1. Book Appointment */}
            <div 
                onClick={() => router.push('/doctors')}
                className="bg-blue-50 border border-blue-200 p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
            >
                <div className="p-3 bg-blue-100 rounded-full text-2xl">📅</div>
                <div>
                    <h3 className="font-bold text-gray-800">Book Appt</h3>
                    <p className="text-xs text-gray-500">Find doctors</p>
                </div>
            </div>

            {/* 2. Medical Records */}
            <div 
                onClick={() => router.push('/medical-records')} 
                className="bg-green-50 border border-green-200 p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-green-400 transition"
            >
                <div className="p-3 bg-green-100 rounded-full text-2xl">📂</div>
                <div>
                    <h3 className="font-bold text-gray-800">Records</h3>
                    <p className="text-xs text-gray-500">Upload reports</p>
                </div>
            </div>

             {/* 3. Prescriptions */}
             <div 
                onClick={() => router.push('/prescriptions')} 
                className="bg-purple-50 border border-purple-200 p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-purple-400 transition"
            >
                <div className="p-3 bg-purple-100 rounded-full text-2xl">📝</div>
                <div>
                    <h3 className="font-bold text-gray-800">Prescriptions</h3>
                    <p className="text-xs text-gray-500">View notes</p>
                </div>
            </div>

            {/* 4. AI Symptom Checker */}
            <div 
                onClick={() => router.push('/symptom-checker')} 
                className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-indigo-400 transition"
            >
                <div className="p-3 bg-indigo-100 rounded-full text-2xl">🤖</div>
                <div>
                    <h3 className="font-bold text-gray-800">Symptom AI</h3>
                    <p className="text-xs text-gray-500">Check health</p>
                </div>
            </div>

             {/* 5. Medicine Interaction Checker */}
             <div 
                onClick={() => router.push('/interaction-checker')} 
                className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-red-400 transition"
            >
                <div className="p-3 bg-red-100 rounded-full text-2xl">💊</div>
                <div>
                    <h3 className="font-bold text-gray-800">Interaction AI</h3>
                    <p className="text-xs text-gray-500">Check meds</p>
                </div>
            </div>

        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Your Upcoming Appointments</h2>

        <div className="flex flex-col gap-4">
            {appointments.length === 0 && !loading ? (
                <p className="text-gray-500 text-center py-10 bg-white rounded shadow-sm">No appointments scheduled.</p>
            ) : (
                appointments.map((appt: any) => {
                    // --- FIND DOCTOR IMAGE ---
                    const docDetails = doctorsData.find(d => d.id === appt.doctor_id);
                    
                    const displayImage = docDetails ? docDetails.image : "https://via.placeholder.com/150";
                    const displayName = docDetails ? docDetails.name : `Dr. ${appt.doctor_name}`;
                    const displaySpeciality = docDetails ? docDetails.speciality : "Specialist";

                    return (
                        <div key={appt.id} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row gap-6 items-center">
                            
                            {/* Doctor Image */}
                            <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                <img src={displayImage} className="w-full h-full object-cover" alt="Doctor" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-lg font-bold text-gray-900">{displayName}</p>
                                <p className="text-blue-600 font-medium text-sm">{displaySpeciality}</p>
                                
                                <div className="mt-2 text-sm text-gray-500 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                                    <span className="bg-gray-100 px-3 py-1 rounded">
                                        📅 {new Date(appt.appointment_date).toDateString()}
                                    </span>
                                    <span className="bg-gray-100 px-3 py-1 rounded">
                                        ⏰ {new Date(appt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded border border-green-100">
                                        Confirmed
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => router.push(`/room/${appt.id}`)}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-medium shadow-sm flex items-center gap-2"
                                >
                                    📹 Join Video
                                </button>
                                
                                <button 
                                    onClick={() => handleCancel(appt.id)}
                                    className="bg-white text-red-500 border border-red-200 px-5 py-2 rounded-lg text-sm hover:bg-red-50 transition font-medium"
                                >
                                    Cancel ✕
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>

      </div>
    </div>
  );
}