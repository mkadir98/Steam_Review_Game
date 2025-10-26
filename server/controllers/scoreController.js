const Score = require('../models/Score');
const User = require('../models/User');

// Helper function to get today's date string
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// @desc    Submit score
// @route   POST /api/scores/submit
// @access  Private
const submitScore = async (req, res) => {
  try {
    const { gameMode, score, reviewsCompleted, reviewsSkipped, hintsUsed, maxStreak } = req.body;

    // Validation
    if (!gameMode || score === undefined || reviewsCompleted === undefined) {
      return res.status(400).json({ 
        message: 'Please provide gameMode, score, and reviewsCompleted' 
      });
    }

    if (!['daily', 'freeplay'].includes(gameMode)) {
      return res.status(400).json({ message: 'Invalid game mode' });
    }

    const todayString = getTodayString();

    // For daily challenge, check if user already submitted today
    if (gameMode === 'daily') {
      const existingScore = await Score.findOne({
        userId: req.user.id,
        gameMode: 'daily',
        date: todayString
      });

      if (existingScore) {
        return res.status(400).json({ 
          message: 'You have already submitted a score for today\'s daily challenge' 
        });
      }

      // Update user's daily challenge status
      await User.findByIdAndUpdate(req.user.id, {
        dailyChallengeCompleted: true,
        lastDailyChallengeDate: new Date()
      });
    }

    // Create score record
    const scoreRecord = await Score.create({
      userId: req.user.id,
      gameMode,
      score,
      reviewsCompleted,
      reviewsSkipped: reviewsSkipped || 0,
      hintsUsed: hintsUsed || 0,
      maxStreak: maxStreak || 0,
      date: todayString
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    user.totalScore += score;
    user.gamesPlayed += 1;
    
    // Update streak for daily challenges
    if (gameMode === 'daily') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      // Check if user played yesterday
      const playedYesterday = await Score.findOne({
        userId: req.user.id,
        gameMode: 'daily',
        date: yesterdayString
      });

      if (playedYesterday) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
    }

    user.lastPlayedDate = new Date();
    await user.save();

    res.status(201).json({
      scoreRecord,
      userStats: {
        totalScore: user.totalScore,
        gamesPlayed: user.gamesPlayed,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get daily leaderboard
// @route   GET /api/scores/leaderboard/daily
// @access  Public
const getDailyLeaderboard = async (req, res) => {
  try {
    const todayString = getTodayString();
    const limit = parseInt(req.query.limit) || 10;

    const scores = await Score.find({
      gameMode: 'daily',
      date: todayString
    })
      .populate('userId', 'username')
      .sort({ score: -1 })
      .limit(limit);

    const leaderboard = scores.map((score, index) => ({
      rank: index + 1,
      username: score.userId.username,
      score: score.score,
      reviewsCompleted: score.reviewsCompleted,
      maxStreak: score.maxStreak,
      date: score.date
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get daily leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all-time leaderboard
// @route   GET /api/scores/leaderboard/alltime
// @access  Public
const getAllTimeLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find()
      .select('username totalScore gamesPlayed streak')
      .sort({ totalScore: -1 })
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalScore: user.totalScore,
      gamesPlayed: user.gamesPlayed,
      streak: user.streak
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get all-time leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's score history
// @route   GET /api/scores/user/:userId
// @access  Public
const getUserScores = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const scores = await Score.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Score.countDocuments({ userId });

    res.json({
      scores,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalScores: total
    });
  } catch (error) {
    console.error('Get user scores error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's current rank
// @route   GET /api/scores/rank/:userId
// @access  Public
const getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count users with higher total score
    const rank = await User.countDocuments({ totalScore: { $gt: user.totalScore } }) + 1;

    // Get total users
    const totalUsers = await User.countDocuments();

    res.json({
      rank,
      totalUsers,
      totalScore: user.totalScore
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitScore,
  getDailyLeaderboard,
  getAllTimeLeaderboard,
  getUserScores,
  getUserRank
};

