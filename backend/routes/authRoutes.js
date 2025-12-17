// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// When user goes to /api/auth/register, run the register function
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;