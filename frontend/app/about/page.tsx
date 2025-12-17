"use client";
import React from "react";

export default function About() {
  return (
    <div className="mx-4 sm:mx-[10%] mb-20">
      
      {/* --- TITLE SECTION --- */}
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>ABOUT <span className="text-gray-700 font-medium">US</span></p>
      </div>

      {/* --- MAIN CONTENT (Image + Text) --- */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        
        {/* Left Side Image */}
        <div className="w-full md:w-[360px]">
             <img 
               className="w-full rounded-lg shadow-md" 
               src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" 
               alt="About TeleMed" 
             />
        </div>

        {/* Right Side Text */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-6">
            <p>
              Welcome to <b>TeleMed</b>, your trusted partner in managing your healthcare needs conveniently and efficiently. 
              At TeleMed, we understand that scheduling doctor appointments can be a hassle, which is why we created a seamless 
              platform to connect you with trusted healthcare professionals in your area.
            </p>
            <p>
              TeleMed is committed to excellence in healthcare technology. We continuously strive to enhance our platform, 
              integrating the latest advancements to improve user experience and deliver superior service. Whether you're 
              booking your first appointment or managing ongoing care, TeleMed is here to support you every step of the way.
            </p>
            
            <b className="text-gray-800">Our Vision</b>
            <p>
              Our vision at TeleMed is to create a seamless healthcare experience for every user. We aim to bridge the gap between 
              patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
        </div>
      </div>

      {/* --- WHY CHOOSE US SECTION --- */}
      <div className="text-xl my-4 text-gray-500">
        <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col md:flex-row mb-20 gap-5">
        
        {/* Card 1 */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg shadow-sm">
            <b className="uppercase">Efficiency:</b>
            <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        {/* Card 2 */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg shadow-sm">
            <b className="uppercase">Convenience:</b>
            <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        {/* Card 3 */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-lg shadow-sm">
            <b className="uppercase">Personalization:</b>
            <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>

      </div>

    </div>
  );
}