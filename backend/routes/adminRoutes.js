// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes
router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.get('/appointments', adminController.getAllAppointments);

module.exports = router;