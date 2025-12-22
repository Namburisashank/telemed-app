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

// 2. Database Connection (HARDCODED FOR SUCCESS)
// We are bypassing process.env to force it to work.
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

// 🛡️ Anti-Crash Handler
pool.on('error', (err) => {
    console.error('❌ Database Error:', err);
});

pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database!'))
    .catch(err => console.error('❌ Connection error', err));

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
    // ... (Keep existing socket logic if needed, or minimal is fine)
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