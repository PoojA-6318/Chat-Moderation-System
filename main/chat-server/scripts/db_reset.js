require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
const RoomRequest = require('../models/RoomRequest');
const ViolationLog = require('../models/ViolationLog');
const Boundary = require('../models/Boundary');

async function resetDB() {
    try {
        console.log('[RESET] Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[RESET] ✅ Connected.');

        // 1. Clear Messages
        console.log('[RESET] Clearing Messages...');
        await Message.deleteMany({});

        // 2. Clear Rooms
        console.log('[RESET] Clearing Rooms...');
        await Room.deleteMany({});

        // 3. Clear Room Requests
        console.log('[RESET] Clearing Room Requests...');
        await RoomRequest.deleteMany({});

        // 4. Clear Violation Logs
        console.log('[RESET] Clearing Violation Logs...');
        await ViolationLog.deleteMany({});

        // 5. Clear Users except Admins
        console.log('[RESET] Clearing non-admin users...');
        const result = await User.deleteMany({ role: { $ne: 'admin' } });
        console.log(`[RESET] Removed ${result.deletedCount} users.`);

        console.log('[RESET] ✨ Database reset complete. Schema and Admin users preserved.');
        process.exit(0);
    } catch (err) {
        console.error('[RESET] ❌ Error during reset:', err.message);
        process.exit(1);
    }
}

resetDB();
