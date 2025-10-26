const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameMode: {
    type: String,
    enum: ['daily', 'freeplay'],
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  reviewsCompleted: {
    type: Number,
    required: true,
    default: 0
  },
  reviewsSkipped: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  }
}, {
  timestamps: true
});

// Index for leaderboards
scoreSchema.index({ gameMode: 1, score: -1 });
scoreSchema.index({ userId: 1, date: 1 });
scoreSchema.index({ date: 1, gameMode: 1 });

module.exports = mongoose.model('Score', scoreSchema);


