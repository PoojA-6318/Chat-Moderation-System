const express = require('express');
const axios = require('axios');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/requests — learner submits a room request
router.post('/', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { topic_name, reason, type, password } = req.body;
        if (!topic_name) {
            return res.status(400).json({ message: 'Topic name is required.' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.user_id },
            select: { name: true }
        });

        let hashedPassword = null;
        if (type === 'private' && password) {
            const bcrypt = require('bcryptjs');
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const request = await prisma.roomRequest.create({
            data: {
                userId: req.user.user_id,
                user_name: user ? user.name : 'Unknown',
                topic_name,
                reason: reason || '',
                type: type === 'private' ? 'private' : 'public',
                password: hashedPassword,
                status: 'pending'
            }
        });
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/requests — admin views all requests (filter by ?status=pending etc.)
router.get('/', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const statusFilter = req.query.status;
        const requests = await prisma.roomRequest.findMany({
            where: statusFilter ? { status: statusFilter } : {},
            orderBy: { created_at: 'desc' }
        });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// PUT /api/requests/:id — admin approves or rejects
router.put('/:id', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { status, admin_comment, room_data } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "approved" or "rejected".' });
        }

        const request = await prisma.roomRequest.findUnique({
            where: { id: req.params.id }
        });
        if (!request) return res.status(404).json({ message: 'Request not found.' });

        // Update request status
        const updatedRequest = await prisma.roomRequest.update({
            where: { id: req.params.id },
            data: {
                status: status,
                admin_note: admin_comment || null
            }
        });

        if (status === 'approved') {
            const finalRoomData = room_data || {
                name: request.topic_name,
                topic: request.topic_name,
                description: request.reason,
                type: request.type,
                password: request.password
            };

            // Create the room
            const room = await prisma.room.create({
                data: {
                    name: finalRoomData.name,
                    topic: finalRoomData.topic,
                    description: finalRoomData.description,
                    type: finalRoomData.type,
                    password: finalRoomData.password,
                    createdById: request.userId,
                    is_approved: true
                }
            });

            // Handle AI embedding if knowledge provided
            if (finalRoomData.knowledge_content) {
                try {
                    await axios.post(`${process.env.AI_SERVICE_URL}/embed-knowledge`, {
                        room_id: room.id,
                        text: finalRoomData.knowledge_content
                    });
                    await prisma.room.update({
                        where: { id: room.id },
                        data: { knowledge_embedded: true }
                    });
                } catch (aiErr) {
                    console.warn('[SERVER] AI embedding failed during request approval:', aiErr.message);
                }
            }
        }

        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = router;
