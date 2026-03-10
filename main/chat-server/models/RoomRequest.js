const mongoose = require('mongoose');

const roomRequestSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    user_name: {
        type: String // Denormalized for display without lookup
    },
    topic_name: {
        type: String,
        required: [true, 'Topic name is required'],
        trim: true
    },
    reason: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    password: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    admin_note: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RoomRequest', roomRequestSchema);
