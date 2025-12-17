"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

// Mock Data (Must match your DB IDs ideally, but for now we use this)
// Updated Mock Data with High-Clarity Images
const doctorsData = [
  {
    id: 1, // Change this ID if your database ID is different
    name: "Dr. Richard James",
    speciality: "General physician",
    exp: "4 Years",
    about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine.",
    fee: 50,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Dr. Emily Larson",
    speciality: "Gynecologist",
    exp: "3 Years",
    about: "Dr. Emily is dedicated to women's health and wellness, providing compassionate care.",
    fee: 60,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    exp: "1 Year",
    about: "Specialist in skin care and treatments, focusing on both medical and cosmetic dermatology.",
    fee: 45,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Dr. Christopher Lee",
    speciality: "Pediatricians",
    exp: "5 Years",
    about: "Expert in child healthcare, dedicated to the well-being and development of infants.",
    fee: 40,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    name: "Dr. Jennifer Garcia",
    speciality: "Neurologist",
    exp: "7 Years",
    about: "Specialized in neurological disorders, committed to providing advanced diagnostics.",
    fee: 70,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "Dr. Andrew Williams",
    speciality: "Gastroenterologist",
    exp: "6 Years",
    about: "Digestive health specialist offering comprehensive care for gastrointestinal conditions.",
    fee: 55,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    name: "Dr. Christopher Davis",
    speciality: "General physician",
    exp: "10 Years",
    about: "Focusing on preventive medicine and overall patient well-being.",
    fee: 50,
    image: "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    name: "Dr. Timothy White",
    speciality: "Gynecologist",
    exp: "8 Years",
    about: "Dedicated to women's health, offering expert care in obstetrics and gynecology.",
    fee: 60,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 9,
    name: "Dr. Ava Mitchell",
    speciality: "Dermatologist",
    exp: "2 Years",
    about: "Skin care and treatments, passionate about helping patients achieve healthy skin.",
    fee: 45,
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&auto=format&fit=crop&q=60"
  },
  {
    id: 10,
    name: "Dr. Jeffrey King",
    speciality: "Pediatricians",
    exp: "4 Years",
    about: "Child healthcare expert providing compassionate and comprehensive care.",
    fee: 40,
    image: "https://images.unsplash.com/photo-1637059824899-a441006a566e?w=400&auto=format&fit=crop&q=60"
  }
];
export default function AppointmentPage() {
  const { doctorId } = useParams();
  const router = useRouter();
  const [docInfo, setDocInfo] = useState<any>(null);
  
  // Slot State
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [docSlots, setDocSlots] = useState<any[]>([]);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // 1. Fetch Doctor Details
  useEffect(() => {
    const doc = doctorsData.find((d) => d.id === Number(doctorId));
    setDocInfo(doc || doctorsData[0]);
  }, [doctorId]);

  // 2. Generate Available Slots
  useEffect(() => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        let endTime = new Date();
        endTime.setDate(today.getDate() + i);
        endTime.setHours(21, 0, 0, 0);

        if (today.getDate() === currentDate.getDate()) {
            currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
            currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
            currentDate.setHours(10);
            currentDate.setMinutes(0);
        }

        let timeSlots = [];
        while (currentDate < endTime) {
            let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            timeSlots.push({
                datetime: new Date(currentDate),
                time: formattedTime
            });
            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }
        allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  }, []);

  // --- NEW: Handle Booking Logic ---
  const bookAppointment = async () => {
    // A. Check Authentication
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
        alert("Please Login to book an appointment");
        router.push('/login');
        return;
    }

    // B. Check if time is selected
    if (!slotTime) {
        alert("Please select a time slot");
        return;
    }

    // C. Create ISO Date String from selection
    // Get the day object from the selected column
    const selectedDay = docSlots[slotIndex][0].datetime; 
    
    // Create a new date object combining Day + Time
    const appointmentDate = new Date(selectedDay);
    
    // Parse the time string "10:30 AM" to set hours/minutes
    const [time, modifier] = slotTime.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));

    try {
        // D. Send to Backend
        const res = await axios.post("http://localhost:5000/api/appointments/book", {
            patientId: user.id,
            doctorId: docInfo.id, // Using the ID from our mock data
            date: appointmentDate.toISOString()
        });

        if (res.status === 200) {
            // E. Show Success and Redirect
            alert("Appointment Booked Successfully! ✅");
            router.push('/dashboard');
        }
    } catch (err) {
        console.error(err);
        alert("Booking Failed. Please try again.");
    }
  };

  if (!docInfo) return <div className="p-10">Loading...</div>;

  return (
    <div className="mx-4 sm:mx-[10%] mt-10">
      
      {/* Doctor Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:max-w-72 bg-blue-600 rounded-lg overflow-hidden relative">
             <img src={docInfo.image} alt="" className="w-full h-auto object-cover absolute bottom-0" />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-sm z-10">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                {docInfo.name} 
                <span className="text-blue-600">✔</span>
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                <p>{docInfo.speciality}</p>
                <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.exp}</button>
            </div>
            <div className="mt-5">
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <span className="text-gray-600 text-xs">ⓘ</span></p>
                <p className="text-sm text-gray-500 max-w-[700px] mt-1 leading-6">{docInfo.about}</p>
            </div>
            <p className="text-gray-500 font-medium mt-4">Appointment fee: <span className="text-gray-600 font-bold">${docInfo.fee}</span></p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>
        
        {/* Days */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-4 hide-scrollbar">
            {docSlots.length > 0 && docSlots.map((item, index) => (
                <div 
                    key={index}
                    onClick={() => setSlotIndex(index)} 
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-600 text-white' : 'border border-gray-200'}`}
                >
                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
            ))}
        </div>

        {/* Times */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 pb-4 hide-scrollbar">
            {docSlots.length > 0 && docSlots[slotIndex].map((item: any, index: number) => (
                <p 
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-blue-600 text-white' : 'text-gray-400 border border-gray-300'}`}
                >
                    {item.time.toLowerCase()}
                </p>
            ))}
        </div>

        {/* Book Button */}
        <button 
            onClick={bookAppointment} 
            className="bg-blue-600 text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:scale-105 transition-all"
        >
            Book an appointment
        </button>

      </div>
    </div>
  );
}