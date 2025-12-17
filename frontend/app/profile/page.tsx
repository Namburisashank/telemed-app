"use client";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    full_name: "User",
    email: "user@example.com",
    phone: "000000000",
    address: "Not Provided",
    gender: "Not Selected",
    dob: "Not Selected",
    image: "" 
  });

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // --- NEW: Toast Notification State ---
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser) {
      setUserData(prev => ({ ...prev, ...storedUser }));
    }
    setLoading(false);
  }, []);

  const handleSave = async () => {
    // 1. Save Data
    localStorage.setItem("user", JSON.stringify(userData));
    setIsEdit(false);

    // 2. Show the Success Popup
    setShowToast(true);

    // 3. Hide it automatically after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 relative">
      
      {/* --- TOAST NOTIFICATION POPUP --- */}
      {showToast && (
        <div className="fixed top-24 right-5 bg-white border-l-4 border-green-500 shadow-xl rounded-r-md p-4 flex items-center gap-4 z-50 min-w-[300px] animate-bounce">
          {/* Green Check Icon */}
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Profile Updated</h4>
            <p className="text-xs text-gray-500">Your details have been saved successfully.</p>
          </div>
          {/* Close Button (X) */}
          <button onClick={() => setShowToast(false)} className="ml-auto text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      )}

      {/* --- Main Profile Card --- */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>
      
      <div className="flex flex-col md:flex-row gap-10 bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
        
        {/* Left: Image */}
        <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-5xl text-gray-300 overflow-hidden mb-4 border-2 border-white shadow-md">
                {userData.image ? (
                    <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span>👤</span> 
                )}
            </div>
            {isEdit ? (
               <input 
                 type="text" 
                 value={userData.full_name} 
                 onChange={e => setUserData({...userData, full_name: e.target.value})}
                 className="text-xl font-medium bg-gray-50 border p-2 rounded w-full text-center"
               />
             ) : (
               <h2 className="text-2xl font-bold text-gray-800">{userData.full_name}</h2>
             )}
        </div>

        {/* Right: Details */}
        <div className="flex-1">
            
            {/* Contact Section */}
            <div className="mb-6">
                <h3 className="text-gray-500 underline mb-4 text-sm font-bold tracking-wider uppercase">Contact Information</h3>
                <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm">
                    <span className="font-medium text-gray-600">Email id:</span>
                    <span className="text-blue-600 font-medium">{userData.email}</span>

                    <span className="font-medium text-gray-600">Phone:</span>
                    {isEdit ? (
                        <input type="text" value={userData.phone} onChange={e => setUserData({...userData, phone: e.target.value})} className="bg-gray-50 border rounded p-1" />
                    ) : (
                        <span className="text-blue-500">{userData.phone}</span>
                    )}

                    <span className="font-medium text-gray-600">Address:</span>
                    {isEdit ? (
                        <input type="text" value={userData.address} onChange={e => setUserData({...userData, address: e.target.value})} className="bg-gray-50 border rounded p-1 w-full" />
                    ) : (
                        <span className="text-gray-500">{userData.address}</span>
                    )}
                </div>
            </div>

            {/* Basic Info Section */}
            <div className="mb-8">
                <h3 className="text-gray-500 underline mb-4 text-sm font-bold tracking-wider uppercase">Basic Information</h3>
                <div className="grid grid-cols-[120px_1fr] gap-y-4 text-sm">
                    <span className="font-medium text-gray-600">Gender:</span>
                    {isEdit ? (
                        <select value={userData.gender} onChange={e => setUserData({...userData, gender: e.target.value})} className="bg-gray-50 border rounded p-1">
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <span className="text-gray-500">{userData.gender}</span>
                    )}

                    <span className="font-medium text-gray-600">Birthday:</span>
                    {isEdit ? (
                        <input type="date" value={userData.dob} onChange={e => setUserData({...userData, dob: e.target.value})} className="bg-gray-50 border rounded p-1" />
                    ) : (
                        <span className="text-gray-500">{userData.dob}</span>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div>
                {isEdit ? (
                  <div className="flex gap-4">
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium shadow-md">
                        Save Information
                    </button>
                    <button onClick={() => setIsEdit(false)} className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition font-medium">
                        Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEdit(true)} className="px-8 py-2 border border-gray-400 text-gray-700 rounded-full hover:bg-black hover:text-white transition font-medium">
                    Edit
                  </button>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}