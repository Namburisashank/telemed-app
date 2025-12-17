"use client";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

export default function Prescriptions() {
  const router = useRouter();

  // Mock Prescription Data
  const prescriptions = [
    { 
        id: 1, 
        doctor: "Dr. Richard James", 
        date: "2025-10-12", 
        medicine: "Paracetamol 500mg (2x daily)\nIbuprofen 200mg (SOS)",
        notes: "Drink plenty of water. Avoid spicy food."
    },
    { 
        id: 2, 
        doctor: "Dr. Emily Larson", 
        date: "2025-09-28", 
        medicine: "Amoxicillin 250mg (3x daily)",
        notes: "Complete the full course of antibiotics."
    },
  ];

  // --- PDF GENERATION FUNCTION ---
  const handleDownload = (script: any) => {
    const doc = new jsPDF();

    // 1. Header
    doc.setFillColor(37, 99, 235); // Blue color
    doc.rect(0, 0, 210, 20, "F"); // Header bar
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("TeleMed - Digital Prescription", 105, 13, { align: "center" });

    // 2. Doctor & Date Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Doctor: ${script.doctor}`, 20, 40);
    doc.text(`Date: ${script.date}`, 150, 40);

    doc.line(20, 45, 190, 45); // Horizontal line

    // 3. Medicines
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Prescribed Medicines:", 20, 60);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    // Split text to wrap if it's too long
    const splitMedicine = doc.splitTextToSize(script.medicine, 170);
    doc.text(splitMedicine, 20, 70);

    // 4. Notes
    if (script.notes) {
        doc.setFont("helvetica", "bold");
        doc.text("Doctor's Notes:", 20, 100);
        doc.setFont("helvetica", "normal");
        doc.text(script.notes, 20, 110);
    }

    // 5. Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a digitally generated prescription from TeleMed.", 105, 280, { align: "center" });

    // 6. Save File
    doc.save(`Prescription_${script.date}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📝 My Prescriptions</h1>

      <div className="grid gap-4">
        {prescriptions.map((script) => (
          <div key={script.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-blue-800">{script.doctor}</h3>
                <p className="text-sm text-gray-500">Date: {script.date}</p>
              </div>
              
              {/* DOWNLOAD BUTTON */}
              <button 
                onClick={() => handleDownload(script)}
                className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
              >
                Download PDF ⬇
              </button>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
              <p className="text-gray-700 font-medium">Rx:</p>
              <p className="text-gray-600 whitespace-pre-line">{script.medicine}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => router.push('/dashboard')} className="mt-10 text-gray-500 hover:text-black">
        ← Back to Dashboard
      </button>
    </div>
  );
}