const mongoose = require('mongoose');

const boundarySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    keywords: {
        type: [String],
        default: []
    },
    patterns: {
        type: [String], // stored as regex strings
        default: []
    },
    is_enabled: {
        type: Boolean,
        default: true
    },
    feedback_msg: {
        type: String,
        default: 'Please keep your message relevant and respectful.'
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Auto-update updated_at on every save
boundarySchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

boundarySchema.pre('findOneAndUpdate', function (next) {
    this.set({ updated_at: Date.now() });
    next();
});

module.exports = mongoose.model('Boundary', boundarySchema);
