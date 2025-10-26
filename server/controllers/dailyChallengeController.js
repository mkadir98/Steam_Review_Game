const DailyChallenge = require('../models/DailyChallenge');
const Review = require('../models/Review');

// @desc    Get all daily challenges
// @route   GET /api/admin/daily-challenges
// @access  Private/Admin
const getAllChallenges = async (req, res) => {
  try {
    const challenges = await DailyChallenge.find()
      .populate('reviewIds', 'gameName gameImage difficulty')
      .populate('createdBy', 'username')
      .sort({ date: -1 })
      .limit(30); // Last 30 days

    res.json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Error fetching challenges' });
  }
};

// @desc    Get today's challenge
// @route   GET /api/admin/daily-challenges/current
// @access  Private/Admin
const getCurrentChallenge = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const challenge = await DailyChallenge.getChallengeByDate(today);

    if (!challenge) {
      return res.status(404).json({ message: 'No challenge set for today' });
    }

    res.json({ challenge });
  } catch (error) {
    console.error('Error fetching current challenge:', error);
    res.status(500).json({ message: 'Error fetching current challenge' });
  }
};

// @desc    Get next challenge (tomorrow's)
// @route   GET /api/admin/daily-challenges/next
// @access  Private/Admin
const getNextChallenge = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const challenge = await DailyChallenge.getChallengeByDate(tomorrowStr);

    if (!challenge) {
      return res.status(404).json({ message: 'No challenge set for tomorrow' });
    }

    res.json({ challenge });
  } catch (error) {
    console.error('Error fetching next challenge:', error);
    res.status(500).json({ message: 'Error fetching next challenge' });
  }
};

// @desc    Create new daily challenge
// @route   POST /api/admin/daily-challenges
// @access  Private/Admin
const createChallenge = async (req, res) => {
  try {
    const { date, reviewIds } = req.body;

    // Validation
    if (!date || !reviewIds || !Array.isArray(reviewIds)) {
      return res.status(400).json({ message: 'Date and reviewIds are required' });
    }

    if (reviewIds.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 reviews must be selected' });
    }

    // Check if reviews exist
    const reviews = await Review.find({ _id: { $in: reviewIds } });
    if (reviews.length !== 3) {
      return res.status(400).json({ message: 'One or more reviews not found' });
    }

    // Check if challenge already exists for this date
    const existing = await DailyChallenge.findOne({ date });
    if (existing) {
      return res.status(400).json({ message: 'Challenge already exists for this date' });
    }

    // Check if the date is today - if so, make it active immediately
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    // If creating today's challenge, deactivate all other challenges first
    if (isToday) {
      await DailyChallenge.updateMany({ isActive: true }, { isActive: false });
    }

    // Create challenge
    const challenge = await DailyChallenge.create({
      date,
      reviewIds,
      createdBy: req.user._id,
      isActive: isToday,
      activatedAt: isToday ? new Date() : undefined
    });

    const populatedChallenge = await DailyChallenge.findById(challenge._id)
      .populate('reviewIds', 'gameName gameImage difficulty')
      .populate('createdBy', 'username');

    res.status(201).json({ 
      message: 'Challenge created successfully',
      challenge: populatedChallenge 
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: error.message || 'Error creating challenge' });
  }
};

// @desc    Update daily challenge
// @route   PUT /api/admin/daily-challenges/:id
// @access  Private/Admin
const updateChallenge = async (req, res) => {
  try {
    const { reviewIds } = req.body;

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 reviews must be selected' });
    }

    // Check if reviews exist
    const reviews = await Review.find({ _id: { $in: reviewIds } });
    if (reviews.length !== 3) {
      return res.status(400).json({ message: 'One or more reviews not found' });
    }

    const challenge = await DailyChallenge.findByIdAndUpdate(
      req.params.id,
      { reviewIds },
      { new: true, runValidators: true }
    )
      .populate('reviewIds', 'gameName gameImage difficulty')
      .populate('createdBy', 'username');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({ 
      message: 'Challenge updated successfully',
      challenge 
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: error.message || 'Error updating challenge' });
  }
};

// @desc    Delete daily challenge
// @route   DELETE /api/admin/daily-challenges/:id
// @access  Private/Admin
const deleteChallenge = async (req, res) => {
  try {
    const challenge = await DailyChallenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Don't allow deleting active challenge
    if (challenge.isActive) {
      return res.status(400).json({ message: 'Cannot delete active challenge' });
    }

    await challenge.deleteOne();

    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Error deleting challenge' });
  }
};

// @desc    Get timer info (next reset time)
// @route   GET /api/game/daily/timer
// @access  Public
const getTimerInfo = async (req, res) => {
  try {
    const now = new Date();
    
    // Calculate next UTC midnight
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(24, 0, 0, 0);
    
    const timeUntilReset = nextMidnight.getTime() - now.getTime();
    
    res.json({
      currentTime: now.toISOString(),
      nextResetTime: nextMidnight.toISOString(),
      millisecondsUntilReset: timeUntilReset,
      secondsUntilReset: Math.floor(timeUntilReset / 1000)
    });
  } catch (error) {
    console.error('Error getting timer info:', error);
    res.status(500).json({ message: 'Error getting timer info' });
  }
};

module.exports = {
  getAllChallenges,
  getCurrentChallenge,
  getNextChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getTimerInfo
};

