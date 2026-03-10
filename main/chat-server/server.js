require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const bcrypt = require('bcryptjs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// ── Prisma Client ─────────────────────────────────────────────────────────────
const prisma = new PrismaClient();

const app = express();
app.set('prisma', prisma); // Make prisma accessible in routes
const server = http.createServer(app);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',  // Vite learner-app
    'http://localhost:5174',  // Vite admin-panel
    process.env.LEARNER_APP_URL,
    process.env.ADMIN_PANEL_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Store io on app for access inside routes if needed
app.set('io', io);

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const requestRoutes = require('./routes/requests');
const boundaryRoutes = require('./routes/boundaries');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/boundaries', boundaryRoutes);
app.use('/api/admin', adminRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Socket.io message handling ────────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const axios = require('axios');

io.on('connection', (socket) => {
    console.log(`[SOCKET] Connected: ${socket.id}`);

    // Join a room
    socket.on('join_room', ({ room_id }) => {
        socket.join(room_id);
        socket.emit('user_joined', { room_id, message: `Joined room ${room_id}` });
        console.log(`[SOCKET] ${socket.id} joined room ${room_id}`);
    });

    // Send message — validated by AI service before broadcast
    socket.on('send_message', async ({ content, room_id, token }) => {
        try {
            // 1. Verify JWT
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch {
                socket.emit('error', { message: 'Invalid session. Please log in again.' });
                return;
            }

            // 2. Lookup user
            const user = await prisma.user.findUnique({ where: { id: decoded.user_id } });
            if (!user) {
                socket.emit('error', { message: 'User not found.' });
                return;
            }

            // 3. Check mute
            if (user.muted_until && user.muted_until > new Date()) {
                socket.emit('muted_warning', {
                    until: user.muted_until,
                    message: `You are muted until ${user.muted_until.toLocaleTimeString()}.`
                });
                return;
            }

            // 4. Call AI service to validate
            let aiResult;
            try {
                const aiRes = await axios.post(
                    `${process.env.AI_SERVICE_URL}/validate`,
                    { message: content, room_id, user_id: user.id },
                    { timeout: 5000 }
                );
                aiResult = aiRes.data;
            } catch (err) {
                // Fail open — if AI service is down, allow message
                console.warn('[SOCKET] AI service unreachable, failing open:', err.message);
                aiResult = { status: 'allowed' };
            }

            // 5. Handle BLOCK
            if (aiResult.status === 'blocked') {
                // Emit only to sender
                socket.emit('message_blocked', {
                    feedback: aiResult.feedback,
                    suggestion: aiResult.suggestion,
                    reason: aiResult.reason,
                    layer_triggered: aiResult.layer_triggered
                });

                // Log violation
                await prisma.violationLog.create({
                    data: {
                        userId: user.id,
                        roomId: room_id,
                        message_content: content.substring(0, 200),
                        violation_category: aiResult.reason || 'unknown',
                        layer_triggered: aiResult.layer_triggered
                    }
                });

                // Increment violation count atomically
                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        violation_count: { increment: 1 },
                        violationHistory: {
                            create: { reason: aiResult.reason || 'policy_violation', date: new Date() }
                        }
                    }
                });

                // Escalating mute
                if (updatedUser.violation_count >= 5) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { muted_until: new Date(Date.now() + 2 * 60 * 60 * 1000) } // 2 hours
                    });
                } else if (updatedUser.violation_count >= 3) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { muted_until: new Date(Date.now() + 30 * 60 * 1000) } // 30 minutes
                    });
                }
                return;
            }

            // 6. ALLOWED — save + broadcast
            const msg = await prisma.message.create({
                data: {
                    roomId: room_id,
                    userId: user.id,
                    username: user.name || 'Anonymous',
                    content,
                    topic_tag: aiResult.topic_tag || null
                }
            });

            io.to(room_id).emit('new_message', {
                _id: msg.id,
                content: msg.content,
                username: msg.username,
                user_id: msg.userId,
                topic_tag: msg.topic_tag,
                created_at: msg.created_at
            });

            socket.emit('message_success', { message: 'Message posted! 🚀' });
        } catch (err) {
            console.error('[SOCKET] send_message error:', err.message);
            socket.emit('error', { message: 'Something went wrong. Please try again.' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] Disconnected: ${socket.id}`);
    });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ── Seed functions ────────────────────────────────────────────────────────────
async function seedAdmin() {
    const adminEmail = 'vrtkaarthik6@gmail.com';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
        const hashed = await bcrypt.hash('hello123', 10);
        await prisma.user.create({
            data: {
                firstName: 'VRT',
                lastName: 'Kaarthik',
                name: 'VRT Kaarthik',
                email: adminEmail,
                password: hashed,
                role: 'admin'
            }
        });
        console.log('[SEED] ✅ Admin user created: vrtkaarthik6@gmail.com');
    } else {
        if (existing.role !== 'admin') {
            await prisma.user.update({
                where: { id: existing.id },
                data: { role: 'admin' }
            });
            console.log('[SEED] ✅ Upgraded existing user to admin: vrtkaarthik6@gmail.com');
        } else {
            console.log('[SEED] Admin user already exists — skipping');
        }
    }
}

async function seedBoundaries() {
    const count = await prisma.boundary.count();
    if (count > 0) {
        console.log('[SEED] Boundaries already seeded — skipping');
        return;
    }

    const defaults = [
        {
            category: 'abuse',
            keywords: ['idiot', 'stupid', 'hate', 'dumb', 'loser', 'moron', 'retard'],
            patterns: [],
            feedback_msg: "Let's keep this space respectful! 😊 Please rephrase your message in a constructive way."
        },
        {
            category: 'politics',
            keywords: ['election', 'government', 'minister', 'vote', 'party', 'bjp', 'congress', 'politician', 'modi', 'rahul'],
            patterns: [],
            feedback_msg: 'This is a learning community — please keep discussions focused on technical topics. 🎓'
        },
        {
            category: 'pii',
            keywords: [],
            patterns: ['\\b[6-9]\\d{9}\\b', '[\\w\\.-]+@[\\w\\.-]+\\.\\w+', 'https?://\\S+|www\\.\\S+', '\\b\\d{4}\\s?\\d{4}\\s?\\d{4}\\b', '\\b[A-Z]{5}[0-9]{4}[A-Z]\\b'],
            feedback_msg: '🔒 Please do not share personal information like phone numbers, emails, or ID numbers in the chat.'
        },
        {
            category: 'spam',
            keywords: ['buy now', 'click here', 'free money', 'limited offer', 'earn from home', 'whatsapp me'],
            patterns: [],
            feedback_msg: '🚫 Promotional or spam content is not allowed here. Please keep posts relevant to learning.'
        },
        {
            category: 'social_media',
            keywords: ['instagram', 'youtube', 'twitter', 'tiktok', 'facebook', 'snapchat', 'telegram', 'discord link'],
            patterns: [],
            feedback_msg: '📵 Please avoid sharing social media links or handles. Stay focused on the topic!'
        }
    ];

    await prisma.boundary.createMany({ data: defaults });
    console.log('[SEED] ✅ 5 default boundary rules created');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function boot() {
    try {
        await prisma.$connect();
        console.log('[DB] ✅ Connected to Neon PostgreSQL via Prisma');
        await seedAdmin();
        await seedBoundaries();
        server.listen(PORT, () => {
            console.log(`[SERVER] 🚀 WeLe Chat Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('[DB] ❌ Database connection or seeding failed:');
        console.error(err);
        process.exit(1);
    }
}

boot();

