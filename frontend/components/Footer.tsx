"use client";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div className="md:mx-10 mt-20">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 text-sm">
        
        {/* Left Section: Brand & Description */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            {/* Simple Logo Icon */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              T
            </div>
            <p className="text-xl font-bold text-blue-600">TeleMed</p>
          </div>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            TeleMed is dedicated to bridging the gap between doctors and patients through secure, high-quality video consultations. Our mission is to make healthcare accessible, affordable, and efficient for everyone, everywhere.
          </p>
        </div>

        {/* Center Section: Links */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-800">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li onClick={() => router.push('/')} className="cursor-pointer hover:text-blue-600">Home</li>
            <li onClick={() => router.push('/contact')} className="cursor-pointer hover:text-blue-600">About us</li>
            <li onClick={() => router.push('/contact')} className="cursor-pointer hover:text-blue-600">Contact us</li>
            <li className="cursor-pointer hover:text-blue-600">Privacy policy</li>
          </ul>
        </div>

        {/* Right Section: Contact Info */}
        <div>
          <p className="text-xl font-medium mb-5 text-gray-800">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+91 987-654-3210</li>
            <li>admin@telemed-project.com</li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Line */}
      <div>
        <hr className="border-gray-300" />
        <p className="py-5 text-sm text-center text-gray-500">
          Copyright 2025 @ TeleMed - All Right Reserved.
        </p>
      </div>
    </div>
  );
}