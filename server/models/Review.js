const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewImages: {
    en: [{
      type: String,
      trim: true
    }],
    fr: [{
      type: String,
      trim: true
    }],
    es: [{
      type: String,
      trim: true
    }],
    it: [{
      type: String,
      trim: true
    }],
    de: [{
      type: String,
      trim: true
    }],
    tr: [{
      type: String,
      trim: true
    }]
  },
  gameName: {
    type: String,
    required: true,
    trim: true
  },
  gameNameLower: {
    type: String,
    lowercase: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  gameImage: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timesPlayed: {
    type: Number,
    default: 0
  },
  timesCorrect: {
    type: Number,
    default: 0
  },
  maxReviews: {
    type: Number,
    default: 3,
    min: 1,
    max: 3
  },
  analytics: {
    totalPlays: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    },
    skips: {
      type: Number,
      default: 0
    },
    hints: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Automatically set gameNameLower before validation (so it's set before save)
reviewSchema.pre('validate', function(next) {
  if (this.gameName) {
    this.gameNameLower = this.gameName.toLowerCase();
  }
  
  // Validate that at least one language has reviews
  const hasReviews = ['en', 'fr', 'es', 'it', 'de', 'tr'].some(lang => 
    this.reviewImages[lang] && this.reviewImages[lang].length > 0
  );
  
  if (!hasReviews) {
    this.invalidate('reviewImages', 'At least one language must have review images');
  }
  
  next();
});

// Index for faster queries
reviewSchema.index({ isActive: 1 });
reviewSchema.index({ gameNameLower: 1 });

module.exports = mongoose.model('Review', reviewSchema);


