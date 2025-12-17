const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // ERROR HAPPENS HERE if 'uploads' folder is missing
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route: Upload MULTIPLE files (Max 10)
// Note: We use 'upload.array' which matches the frontend 'files'
router.post('/', upload.array('files', 10), (req, res) => {
    try {
        const filePaths = req.files.map(file => `/uploads/${file.filename}`);
        res.json({ 
            message: 'Files Uploaded Successfully', 
            filePaths: filePaths 
        });
    } catch (err) {
        res.status(500).json({ message: 'Upload failed' });
    }
});

module.exports = router;