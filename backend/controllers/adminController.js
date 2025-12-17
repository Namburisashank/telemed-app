const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

exports.getStats = async (req, res) => {
    try {
        const patients = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'patient'");
        const doctors = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'doctor'");
        const appointments = await pool.query("SELECT COUNT(*) FROM appointments");

        res.json({
            patients: patients.rows[0].count,
            doctors: doctors.rows[0].count,
            appointments: appointments.rows[0].count
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT id, full_name, email, role FROM users ORDER BY id DESC");
        res.json(users.rows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await pool.query(
            `SELECT a.id, a.appointment_date, a.status, 
                    p.full_name as patient_name, 
                    d.full_name as doctor_name 
             FROM appointments a 
             JOIN users p ON a.patient_id = p.id 
             JOIN users d ON a.doctor_id = d.id 
             ORDER BY a.appointment_date DESC`
        );
        res.json(appointments.rows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};