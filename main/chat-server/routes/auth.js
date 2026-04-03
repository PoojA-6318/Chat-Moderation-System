const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ── Multer Setup ──────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.pdf' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(new Error('Only PDF and images are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Helper — sign a JWT token
const signToken = (user) =>
    jwt.sign(
        { user_id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', upload.single('certificate'), async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { firstName, lastName, email, password, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'First name, last name, email, and password are required.' });
        }

        // Check for existing user
        const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existing) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        const newUserRole = (role === 'mentor' || role === 'admin') ? role : 'learner';
        const mentorStatus = newUserRole === 'mentor' ? 'pending' : 'none';

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email: email.toLowerCase(),
                password: hashed,
                role: newUserRole,
                mentorStatus: mentorStatus,
                certificateUrl: req.file ? `/uploads/${req.file.filename}` : null
            }
        });

        const token = signToken(user);

        return res.status(201).json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                name: user.name,
                email: user.email,
                role: user.role,
                mentorStatus: user.mentorStatus,
                certificateUrl: user.certificateUrl
            }
        });
    } catch (err) {
        console.error('[AUTH] Register error:', err.message);
        return res.status(500).json({ message: err.message || 'Server error during registration.' });
    }
});


// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const prisma = req.app.get('prisma');
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = signToken(user);

        return res.status(200).json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                name: user.name,
                email: user.email,
                role: user.role,
                mentorStatus: user.mentorStatus
            }
        });
    } catch (err) {
        console.error('[AUTH] Login error:', err.message);
        return res.status(500).json({ message: 'Server error during login.' });
    }
});


module.exports = router;
