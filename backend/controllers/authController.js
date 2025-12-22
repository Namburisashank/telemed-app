const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 🛑 HARDCODED DATABASE CONNECTION (The "Nuclear Option")
// This ensures Registration works on Render, no matter what.
const pool = new Pool({
    user: 'neondb_owner',
    host: 'ep-sparkling-unit-a117ntvv-pooler.ap-southeast-1.aws.neon.tech',
    database: 'neondb',
    password: 'npg_q2uQT4AYbBij',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

exports.register = async (req, res) => {
    // 1. Get data from the frontend
    const { full_name, email, password, role } = req.body;

    try {
        // 2. Check if user already exists
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // 3. Hash the password (Security)
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 4. Save to Database
        const newUser = await pool.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
            [full_name, email, password_hash, role]
        );

        // 5. Generate a Token
        const token = jwt.sign(
            { id: newUser.rows[0].id, role: role },
            'secret_key_123', 
            { expiresIn: '1h' }
        );

        res.json({ message: 'User registered!', token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Check the password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role }, 
            'secret_key_123', 
            { expiresIn: '1h' }
        );

        res.json({ token, user: user.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};