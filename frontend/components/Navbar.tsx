"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null); // Reference for the menu

  // Load user from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  // --- NEW: CLOSE MENU WHEN CLICKING OUTSIDE ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-200 mx-4 sm:mx-[10%]">
      
      {/* --- LOGO --- */}
      <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer">
         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
             T
         </div>
         <h1 className="text-xl font-bold text-blue-600">TeleMed</h1>
      </div>

      {/* --- MIDDLE LINKS --- */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <li onClick={() => router.push('/')} className="py-1 cursor-pointer hover:text-blue-600">HOME</li>
        <li onClick={() => router.push('/doctors')} className="py-1 cursor-pointer hover:text-blue-600">ALL DOCTORS</li>
        <li onClick={() => router.push('/about')} className="py-1 cursor-pointer hover:text-blue-600">ABOUT</li>
        <li onClick={() => router.push('/contact')} className="py-1 cursor-pointer hover:text-blue-600">CONTACT</li>
      </ul>

      {/* --- RIGHT SIDE (Profile or Login) --- */}
      <div className="flex items-center gap-4">
        {user ? (
          // Added 'ref={menuRef}' here so we can detect clicks inside/outside this box
          <div className="relative group" ref={menuRef}>
            {/* Profile Icon / Image */}
            <div 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 cursor-pointer"
            >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 text-blue-600 font-bold">
                   {user.image ? (
                     <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <span>{user.full_name ? user.full_name[0].toUpperCase() : "U"}</span>
                   )}
                </div>
                {/* Small Arrow Icon */}
                <svg className={`w-2.5 h-2.5 text-gray-600 transition-transform ${showMenu ? 'rotate-180' : ''}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
                <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20">
                    <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg border border-stone-200">
                        <p 
                          onClick={() => { router.push('/profile'); setShowMenu(false); }} 
                          className="hover:text-black cursor-pointer"
                        >
                          My Profile
                        </p>
                        <p 
                          onClick={() => { router.push('/dashboard'); setShowMenu(false); }} 
                          className="hover:text-black cursor-pointer"
                        >
                          My Appointments
                        </p>
                        <p 
                          onClick={handleLogout} 
                          className="hover:text-black cursor-pointer text-red-500"
                        >
                          Logout
                        </p>
                    </div>
                </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-blue-700 transition"
          >
            Create account
          </button>
        )}
      </div>
    </div>
  );
}