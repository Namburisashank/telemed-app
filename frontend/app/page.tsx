"use client";
import { useRouter } from "next/navigation";

// Mock Data for Top Doctors
const topDoctors = [
  { id: 3, name: "Dr. Richard James", speciality: "General physician", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 4, name: "Dr. Emily Larson", speciality: "Gynecologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 5, name: "Dr. Sarah Patel", speciality: "Dermatologist", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 6, name: "Dr. Christopher Lee", speciality: "Pediatricians", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 7, name: "Dr. Jennifer Garcia", speciality: "Neurologist", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 8, name: "Dr. Andrew Williams", speciality: "Gastroenterologist", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 9, name: "Dr. Christopher Davis", speciality: "General physician", image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5473?auto=format&fit=crop&q=80&w=800", status: "Available" },
  { id: 10, name: "Dr. Timothy White", speciality: "Gynecologist", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800", status: "Available" },
];

export default function Home() {
  const router = useRouter();

  const specialities = [
    { name: "General physician", icon: "🩺" },
    { name: "Gynecologist", icon: "🤰" },
    { name: "Dermatologist", icon: "🧖‍♀️" },
    { name: "Pediatricians", icon: "👶" },
    { name: "Neurologist", icon: "🧠" },
    { name: "Gastroenterologist", icon: "🍽️" },
  ];

  return (
    <div className="mx-4 sm:mx-[10%]">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-blue-600 rounded-lg px-6 md:px-10 lg:px-20 pt-10 pb-0 md:pb-0 text-white flex flex-col md:flex-row items-center gap-10 my-10 overflow-hidden relative shadow-lg">
        
        {/* Left Text */}
        <div className="flex-1 py-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Book Appointment <br /> With 100+ Trusted Doctors
            </h1>
            <div className="flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/68.jpg" alt="" />
                </div>
                <p className="text-sm font-light">
                    Simply browse through our extensive list of trusted doctors, <br className="hidden sm:block"/> 
                    schedule your appointment hassle-free.
                </p>
            </div>
            <button 
                onClick={() => router.push('/doctors')}
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:scale-105 transition-all shadow-md"
            >
                Book appointment
            </button>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 lg:w-[400px] relative">
            <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" 
                alt="Doctor Header" 
                className="w-full h-auto object-cover bottom-0"
            />
        </div>
      </div>

      {/* --- FIND BY SPECIALITY --- */}
      <div className="text-center my-16">
        <h2 className="text-3xl font-bold text-gray-800">Find by Speciality</h2>
        <p className="text-gray-600 mt-2 text-sm sm:w-1/2 mx-auto">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
        </p>
        
        <div className="flex justify-center gap-6 pt-10 w-full overflow-scroll hide-scrollbar">
            {specialities.map((item, index) => (
                <div 
                    key={index} 
                    onClick={() => router.push(`/doctors`)}
                    className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-2 transition-all duration-300 min-w-[100px]"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl shadow-sm border border-blue-100 hover:bg-blue-100">
                        {item.icon}
                    </div>
                    <p className="text-xs font-medium text-gray-700">{item.name}</p>
                </div>
            ))}
        </div>
      </div>

      {/* --- TOP DOCTORS TO BOOK --- */}
      <div className="text-center my-16">
        <h2 className="text-3xl font-bold text-gray-800">Top Doctors to Book</h2>
        <p className="text-gray-600 mt-2 text-sm sm:w-1/2 mx-auto mb-10">
            Simply browse through our extensive list of trusted doctors.
        </p>

        <div className="grid grid-cols-auto gap-4 gap-y-6 pt-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {topDoctors.slice(0, 8).map((item) => (
                <div 
                    key={item.id}
                    onClick={() => router.push(`/appointment/${item.id}`)}
                    className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-md text-left bg-white"
                >
                    <div className="bg-blue-50 h-48 flex items-end justify-center">
                        <img src={item.image} alt="" className="w-full h-full object-cover object-top" />
                    </div>
                    
                    <div className="p-4">
                        <div className="flex items-center gap-2 text-sm text-center text-green-500 mb-2">
                            <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                            <p>Available</p>
                        </div>
                        <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.speciality}</p>
                    </div>
                </div>
            ))}
        </div>

        <button 
            onClick={() => router.push('/doctors')}
            className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 font-medium hover:bg-blue-100 transition-all border border-blue-200"
        >
            more
        </button>
      </div>

      {/* --- CREATE ACCOUNT BANNER --- */}
      <div className="bg-blue-600 rounded-lg px-6 md:px-14 lg:px-20 py-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 my-20 shadow-lg">
         <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Book Appointment <br /> With 100+ Trusted Doctors
            </h1>
            <button 
                onClick={() => router.push('/register')} 
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:scale-105 transition-all shadow-md mt-4"
            >
                Create account
            </button>
         </div>
         
         <div className="hidden md:block w-[300px]">
             {/* You can add another illustration image here if you have one */}
         </div>
      </div>

    </div>
  );
}