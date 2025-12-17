"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock Data to match the screenshot visuals
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
export default function DoctorsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");

  // Filter Logic
  const filteredDoctors = filter === "All" 
    ? doctorsData 
    : doctorsData.filter(doc => doc.speciality === filter);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ];

  return (
    <div className="mx-4 sm:mx-[10%] mt-10">
      
      <p className="text-gray-600 mb-5">Browse through the doctors specialist.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        
        {/* --- Left Sidebar (Filters) --- */}
        <div className="flex flex-col gap-4 text-sm text-gray-600 min-w-[180px]">
          {specialities.map((spec) => (
            <p 
              key={spec}
              onClick={() => setFilter(filter === spec ? "All" : spec)}
              className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${filter === spec ? "bg-indigo-100 text-black font-medium" : ""}`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* --- Right Grid (Doctor Cards) --- */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6 pt-5 sm:pt-0" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {filteredDoctors.map((item) => (
            <div 
              key={item.id}
             onClick={() => router.push(`/appointment/${item.id}`)} // Redirects to booking page when clicked
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-md"
            >
              <div className="bg-blue-50 h-48 flex items-end justify-center">
                 <img src={item.image} alt="" className="w-full h-full object-cover object-top" />
              </div>
              
              <div className="p-4">
                {/* Availability Status */}
                <div className="flex items-center gap-2 text-sm text-center text-green-500 mb-2">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                </div>
                
                {/* Name & Title */}
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}