const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePrescription = (req, res) => {
    const { doctorName, patientName, diagnosis, medicines, notes } = req.body;

    // 1. Create a new PDF document
    const doc = new PDFDocument();
    
    // 2. Define where to save it
    const filename = `prescription-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../uploads', filename);
    const writeStream = fs.createWriteStream(filePath);

    // 3. Pipe the PDF into the file
    doc.pipe(writeStream);

    // --- DRAWING THE PDF CONTENT ---
    
    // Header
    doc.fontSize(20).text('TeleMed Hospital', { align: 'center' });
    doc.fontSize(10).text('123 Health Street, Guntur, AP', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('OFFICIAL PRESCRIPTION', { align: 'center', underline: true });
    doc.moveDown();

    // Doctor & Patient Info
    doc.fontSize(12).text(`Doctor: ${doctorName}`, { align: 'left' });
    doc.text(`Patient: ${patientName}`, { align: 'right' }); // This line might overlap, simpler to put on next line if names are long
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Horizontal Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text(`Diagnosis: ${diagnosis}`);
    doc.moveDown();

    // Medicines List
    doc.fontSize(14).text('Medicines:', { underline: true });
    doc.fontSize(12);
    
    // Loop through medicines array
    medicines.forEach((med, index) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage} (${med.frequency})`);
    });

    doc.moveDown();
    
    // Notes
    if (notes) {
        doc.fontSize(12).text(`Notes: ${notes}`);
    }

    // Footer
    doc.moveDown(4);
    doc.fontSize(10).text('This is a computer-generated prescription.', { align: 'center', color: 'gray' });

    // 4. Finalize the PDF
    doc.end();

    // 5. Send the URL back to Frontend
    writeStream.on('finish', () => {
        res.json({ 
            message: 'Prescription Generated!', 
            downloadLink: `/uploads/${filename}` 
        });
    });

    writeStream.on('error', (err) => {
        console.error(err);
        res.status(500).json({ message: 'Error generating PDF' });
    });
};