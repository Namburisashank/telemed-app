require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 1. Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Database Connection (WITH AUTO-CLEAN FIX)
let poolConfig;

if (process.env.DATABASE_URL) {
    // 🧹 MAGIC FIX: Remove incompatible settings from the URL automatically
    const cleanConnectionString = process.env.DATABASE_URL.split('?')[0];
    
    console.log("☁️  Connecting to Cloud Database (Auto-Cleaned)...");
    poolConfig = {
        connectionString: cleanConnectionString, // Uses the cleaned URL
        ssl: { rejectUnauthorized: false }       // Manually enables SSL
    };
} else {
    console.log("💻  Connecting to Local Database...");
    poolConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };
}

const pool = new Pool(poolConfig);

// 🛡️ CRITICAL: Prevent server crash on idle connection errors
pool.on('error', (err) => {
    console.error('❌ Unexpected Error on Idle Database Client', err);
    // Do not exit, just log it. This keeps the server alive.
});

pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database!'))
    .catch(err => console.error('❌ Connection error', err.stack));

// 3. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 4. Real-Time Engine
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on('connection', (socket) => {
    console.log(`⚡ New Client Connected: ${socket.id}`);
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });
    socket.on('offer', (payload) => io.to(payload.target).emit('offer', payload));
    socket.on('answer', (payload) => io.to(payload.target).emit('answer', payload));
    socket.on('ice-candidate', (incoming) => io.to(incoming.target).emit('ice-candidate', incoming.candidate));
    socket.on('send-message', (data) => socket.to(data.roomId).emit('receive-message', data));
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});