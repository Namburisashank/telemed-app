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

// Enable Static Files (Make uploads folder publicly accessible)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Database Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

// 4. Real-Time Engine (Socket.IO & WebRTC)
const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from anywhere
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`⚡ New Client Connected: ${socket.id}`);

    // --- WebRTC Signaling Events ---

    // A. Join Room
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${userId || 'Anon'} joined room: ${roomId}`);
        
        // Notify others
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });

    // B. Offer
    socket.on('offer', (payload) => {
        io.to(payload.target).emit('offer', payload);
    });

    // C. Answer
    socket.on('answer', (payload) => {
        io.to(payload.target).emit('answer', payload);
    });

    // D. ICE Candidate
    socket.on('ice-candidate', (incoming) => {
        io.to(incoming.target).emit('ice-candidate', incoming.candidate);
    });

    // --- E. NEW: Text Chat ---
    socket.on('send-message', (data) => {
        // Broadcast to everyone ELSE in the room
        socket.to(data.roomId).emit('receive-message', data);
    });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server (HTTP + Socket) running on port ${PORT}`);
});