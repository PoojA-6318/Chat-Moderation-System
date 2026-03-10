const mongoose = require('mongoose');

const violationLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    message_content: {
        type: String // First 200 chars of blocked message
    },
    violation_category: {
        type: String // e.g. 'abuse', 'politics', 'pii', 'off-topic'
    },
    layer_triggered: {
        type: String // e.g. '1-pii', '2-keyword', '3-toxicity', '4-topic', '5-llm'
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('ViolationLog', violationLogSchema);
