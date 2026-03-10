const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms — all approved public rooms
router.get('/', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const rooms = await prisma.room.findMany({
            where: {
                is_active: true,
                is_approved: true,
                type: 'public'
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/rooms/:id — single room
router.get('/:id', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const room = await prisma.room.findUnique({
            where: { id: req.params.id }
        });
        if (!room) return res.status(404).json({ message: 'Room not found.' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/rooms/:id/messages — last 50 messages
router.get('/:id/messages', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const messages = await prisma.message.findMany({
            where: { roomId: req.params.id },
            orderBy: { created_at: 'desc' },
            take: 50
        });
        res.json(messages.reverse());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/rooms — create room (admin-only for direct creation, or learners for private)
router.post('/', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { name, topic, description, type, password, knowledge_content } = req.body;
        if (!name || !topic) {
            return res.status(400).json({ message: 'Room name and topic are required.' });
        }

        const isAdmin = req.user.role === 'admin';
        const isPublic = type === 'public';

        // Only admins can create public rooms directly through this endpoint
        if (isPublic && !isAdmin) {
            return res.status(403).json({ message: 'Learners can only create private rooms directly.' });
        }

        const roomData = {
            name,
            topic,
            description: description || '',
            type: type === 'private' ? 'private' : 'public',
            createdById: req.user.user_id,
            is_approved: isPublic ? true : true // Private rooms are auto-approved
        };

        if (type === 'private' && password) {
            roomData.password = await bcrypt.hash(password, 10);
        }

        const room = await prisma.room.create({
            data: roomData
        });

        // If knowledge provided, tell AI Service to embed it
        if (knowledge_content) {
            try {
                await axios.post(`${process.env.AI_SERVICE_URL}/embed-knowledge`, {
                    room_id: room.id,
                    text: knowledge_content
                });
                await prisma.room.update({
                    where: { id: room.id },
                    data: { knowledge_embedded: true }
                });
            } catch (aiErr) {
                console.warn('[SERVER] AI embedding failed:', aiErr.message);
            }
        }

        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/rooms/join-private — join a private room with password
router.post('/join-private', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { room_id, password } = req.body;
        const room = await prisma.room.findUnique({
            where: { id: room_id }
        });

        if (!room || room.type !== 'private') {
            return res.status(404).json({ message: 'Private room not found.' });
        }

        const isMatch = await bcrypt.compare(password, room.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password for private room.' });
        }

        res.json({ message: 'Successfully joined private room.', room });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/rooms/:id/approve — admin-only approval
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const room = await prisma.room.update({
            where: { id: req.params.id },
            data: { is_approved: true }
        });
        res.json({ message: 'Room approved successfully.', room });
    } catch (err) {
        res.status(500).json({ message: 'Room not found or update failed.' });
    }
});

// DELETE /api/rooms/:id — admin-only deletion
router.delete('/:id', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        // Prisma will handle message deletion via onDelete: Cascade if configured in schema
        const room = await prisma.room.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Room and its messages deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Room not found or deletion failed.' });
    }
});


module.exports = router;

