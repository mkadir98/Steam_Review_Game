const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
    unique: true,
    index: true
  },
  reviewIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  }],
  isActive: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  activatedAt: {
    type: Date
  }
});

// Validation: Must have exactly 3 reviews
dailyChallengeSchema.pre('validate', function(next) {
  if (this.reviewIds && this.reviewIds.length !== 3) {
    this.invalidate('reviewIds', 'Daily Challenge must have exactly 3 reviews');
  }
  next();
});

// Static method to get today's challenge
dailyChallengeSchema.statics.getTodaysChallenge = async function() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return await this.findOne({ date: today, isActive: true }).populate('reviewIds');
};

// Static method to get challenge by date
dailyChallengeSchema.statics.getChallengeByDate = async function(dateString) {
  return await this.findOne({ date: dateString })
    .populate('reviewIds')
    .populate('createdBy', 'username');
};

// Static method to activate today's challenge if exists
dailyChallengeSchema.statics.activateTodaysChallenge = async function() {
  const today = new Date().toISOString().split('T')[0];
  
  // Deactivate all previous challenges
  await this.updateMany({ isActive: true }, { isActive: false });
  
  // Activate today's challenge
  const challenge = await this.findOneAndUpdate(
    { date: today },
    { isActive: true, activatedAt: new Date() },
    { new: true }
  );
  
  return challenge;
};

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
