const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// Centralized Database Connection
// (If you made a config/db.js file, you can require that instead. 
//  Otherwise, this standard connection block works perfectly.)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Add SSL if using Cloud DB (Neon), remove if using Localhost
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL : undefined,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined
});

// 1. Get List of All Doctors (From Database Users)
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await pool.query("SELECT id, full_name, email FROM users WHERE role = 'doctor'");
        res.json(doctors.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. Book an Appointment
router.post('/book', async (req, res) => {
    const { patientId, doctorId, date } = req.body;
    
    try {
        const newAppointment = await pool.query(
            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, status) VALUES ($1, $2, $3, 'confirmed') RETURNING *",
            [patientId, doctorId, date]
        );
        res.json(newAppointment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 3. Get My Appointments (UPDATED FOR FIX)
// We added 'a.doctor_id' to the SELECT statement here.
router.get('/my-appointments/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const appointments = await pool.query(
            `SELECT a.id, a.appointment_date, a.status, a.doctor_id, 
                    u.full_name as doctor_name 
             FROM appointments a 
             JOIN users u ON a.doctor_id = u.id 
             WHERE a.patient_id = $1
             ORDER BY a.appointment_date ASC`,
            [userId]
        );
        res.json(appointments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 4. Cancel (Delete) an Appointment
router.delete('/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM appointments WHERE id = $1", [id]);
        res.json({ message: "Appointment Cancelled" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;