const express = require('express');
const axios = require('axios');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Helper: invalidate AI service boundary cache
async function invalidateCache() {
    try {
        await axios.get(`${process.env.AI_SERVICE_URL}/invalidate-cache`, { timeout: 3000 });
        console.log('[CACHE] Boundary cache invalidated');
    } catch (err) {
        console.warn('[CACHE] Could not invalidate cache:', err.message);
    }
}

// GET /api/boundaries — all boundaries
router.get('/', protect, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const boundaries = await prisma.boundary.findMany({
            orderBy: { category: 'asc' }
        });
        res.json(boundaries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/boundaries — admin creates new boundary
router.post('/', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { category, keywords, patterns, is_enabled, feedback_msg } = req.body;
        if (!category) return res.status(400).json({ message: 'Category is required.' });

        const boundary = await prisma.boundary.create({
            data: {
                category,
                keywords: keywords || [],
                patterns: patterns || [],
                is_enabled: is_enabled !== undefined ? is_enabled : true,
                feedback_msg: feedback_msg || ''
            }
        });

        await invalidateCache();
        res.status(201).json(boundary);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ message: `Boundary category "${req.body.category}" already exists.` });
        }
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/boundaries/:id — admin updates boundary
router.patch('/:id', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const updated = await prisma.boundary.update({
            where: { id: req.params.id },
            data: req.body
        });
        await invalidateCache();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Boundary not found or update failed.' });
    }
});

// DELETE /api/boundaries/:id — admin removes boundary
router.delete('/:id', protect, adminOnly, async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        await prisma.boundary.delete({
            where: { id: req.params.id }
        });
        await invalidateCache();
        res.json({ message: 'Boundary deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Boundary not found or deletion failed.' });
    }
});


module.exports = router;
