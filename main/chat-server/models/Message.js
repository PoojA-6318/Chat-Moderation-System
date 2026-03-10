const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Room ID is required'],
        index: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
        // Denormalized to avoid lookups on every message fetch
    },
    content: {
        type: String,
        required: [true, 'Message content is required']
    },
    moderation_status: {
        type: String,
        default: 'allowed'
    },
    topic_tag: {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index for efficient room + time queries
messageSchema.index({ room_id: 1, created_at: -1 });

module.exports = mongoose.model('Message', messageSchema);
