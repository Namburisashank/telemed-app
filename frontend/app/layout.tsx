import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"; // <--- 1. Import Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeleMed App",
  description: "Doctor Appointment System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mx-4 sm:mx-[10%]`}> {/* Added margin for better look */}
        
        <Navbar /> {/* <--- 2. Add Navbar at the TOP */}
        
        {children}
        
        <Footer />
      </body>
    </html>
  );
}