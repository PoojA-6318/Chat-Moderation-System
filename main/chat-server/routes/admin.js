const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/stats — aggregated dashboard data
router.get('/stats', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [
            total_rooms,
            total_users,
            violations_today,
            pending_requests,
            violations_by_category_raw,
            recent_violations_raw
        ] = await Promise.all([
            prisma.room.count({ where: { is_active: true } }),
            prisma.user.count({ where: { role: 'learner' } }),
            prisma.violationLog.count({ where: { created_at: { gte: startOfToday } } }),
            prisma.roomRequest.count({ where: { status: 'pending' } }),
            prisma.violationLog.groupBy({
                by: ['violation_category'],
                _count: { _all: true }
            }),
            prisma.violationLog.findMany({
                take: 10,
                orderBy: { created_at: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                    room: { select: { name: true } }
                }
            })
        ]);

        // Reformat violations_by_category to match Mongoose aggregate output if frontend expects it
        const violations_by_category = violations_by_category_raw.map(v => ({
            _id: v.violation_category,
            count: v._count._all
        }));

        // Reformat recent_violations to map user/room relations to user_id/room_id keys if needed by frontend
        const recent_violations = recent_violations_raw.map(v => ({
            ...v,
            user_id: v.user,
            room_id: v.room
        }));

        res.json({
            total_rooms,
            total_users,
            violations_today,
            pending_requests,
            violations_by_category,
            recent_violations
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/violation-logs — detailed violation logs
router.get('/violation-logs', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const logs = await prisma.violationLog.findMany({
            take: 50,
            orderBy: { created_at: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                room: { select: { name: true } }
            }
        });

        const mappedLogs = logs.map(l => ({
            ...l,
            user_id: l.user,
            room_id: l.room
        }));

        res.json(mappedLogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/users — list all learners (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const users = await prisma.user.findMany({
            orderBy: { created_at: 'desc' }
        });
        // Remove passwords
        const safeUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
        res.json(safeUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/grant-access — admin promotes a user to admin by email
router.post('/grant-access', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({ message: `No user found with email: ${email}` });
        }

        if (user.role === 'admin') {
            return res.status(200).json({ message: `${email} is already an admin.` });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'admin' }
        });

        console.log(`[ADMIN] Granted admin access to ${email} by ${req.user.email}`);
        res.json({ message: `✅ Admin access granted to ${email}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/admin/revoke-access — admin strips admin role from a user
router.delete('/revoke-access', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        // Prevent revoking the primary admin
        if (email.toLowerCase() === 'vrtkaarthik6@gmail.com') {
            return res.status(403).json({ message: 'Cannot revoke access from the primary admin.' });
        }

        const user = await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: { role: 'learner' }
        });
        if (!user) return res.status(404).json({ message: `No user found with email: ${email}` });

        res.json({ message: `Admin access revoked from ${email}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/admin/mentors/pending — list pending mentor applications
router.get('/mentors/pending', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const mentors = await prisma.user.findMany({
            where: { role: 'mentor', mentorStatus: 'pending' },
            orderBy: { created_at: 'desc' }
        });
        const safeMentors = mentors.map(m => {
            const { password, ...rest } = m;
            return rest;
        });
        res.json(safeMentors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/admin/mentors/verify — approve or reject a mentor
router.post('/mentors/verify', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { user_id, status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be approved or rejected.' });
        }

        const user = await prisma.user.update({
            where: { id: user_id },
            data: {
                mentorStatus: status,
                isTeacher: status === 'approved' ? true : undefined
            }
        });

        res.json({ message: `Mentor application ${status}.`, user });
    } catch (err) {
        res.status(500).json({ message: 'User not found or update failed.' });
    }
});

// GET /api/admin/rooms/all — list all rooms for management
router.get('/rooms/all', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                created_by: {
                    select: { name: true, email: true }
                }
            }
        });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

