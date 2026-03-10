const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Room name is required'],
        trim: true
    },
    topic: {
        type: String,
        required: [true, 'Room topic is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    blocked_topics: {
        type: [String],
        default: []
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_approved: {
        type: Boolean,
        default: true
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
    knowledge_embedded: {
        type: Boolean,
        default: false
    },
    member_count: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomSchema);
