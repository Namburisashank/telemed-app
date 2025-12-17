const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Route: POST /api/prescriptions/generate
router.post('/generate', prescriptionController.generatePrescription);

module.exports = router;