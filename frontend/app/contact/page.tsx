"use client";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar (Simple version) */}
      <nav className="flex justify-between items-center p-5 border-b shadow-sm max-w-6xl mx-auto">
        <h1 
          onClick={() => router.push('/')} 
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          TeleMed 🏥
        </h1>
        <div className="flex gap-6 text-gray-700 font-medium">
          <button onClick={() => router.push('/')} className="hover:text-blue-600">HOME</button>
          <button onClick={() => router.push('/book')} className="hover:text-blue-600">ALL DOCTORS</button>
          <button className="text-black font-bold border-b-2 border-black">CONTACT</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-2xl text-gray-500 uppercase tracking-widest">
            Contact <span className="text-gray-900 font-bold">Us</span>
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop" 
              alt="Doctor Office" 
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
          </div>

          {/* Right: Contact Details */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            
            {/* Office Info */}
            <div>
              <h3 className="text-gray-700 font-bold text-lg mb-4 uppercase">Our Office</h3>
              <p className="text-gray-600 leading-relaxed">
                123 Health Street, Near Guntur Medical College<br />
                Guntur, Andhra Pradesh, India - 522002
              </p>
              <p className="text-gray-600 mt-4">
                <strong>Tel:</strong> (0863) 555-0123 <br />
                <strong>Email:</strong> admin@telemed-project.com
              </p>
            </div>

            {/* Careers Section */}
            <div>
              <h3 className="text-gray-700 font-bold text-lg mb-4 uppercase">Careers at TeleMed</h3>
              <p className="text-gray-600 mb-6">
                Learn more about our teams and job openings.
              </p>
              <button 
                onClick={() => alert("Job portal coming soon!")}
                className="border border-black px-6 py-3 text-sm font-semibold hover:bg-black hover:text-white transition duration-300"
              >
                Explore Jobs
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}