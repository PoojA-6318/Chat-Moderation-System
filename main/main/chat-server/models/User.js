const mongoose = require('mongoose');

const violationEntrySchema = new mongoose.Schema({
  reason: { type: String },
  date: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  mentorStatus: {
    type: String,
    enum: ['none', 'pending', 'approved', 'rejected'],
    default: 'none'
  },
  isTeacher: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['admin', 'learner', 'mentor'],
    default: 'learner'
  },
  certificateUrl: {
    type: String,
    default: null
  },
  violation_count: {
    type: Number,
    default: 0
  },
  muted_until: {
    type: Date,
    default: null
  },
  violation_history: {
    type: [violationEntrySchema],
    default: [],
    validate: {
      validator: function (arr) { return arr.length <= 20; },
      message: 'Violation history cannot exceed 20 entries'
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
