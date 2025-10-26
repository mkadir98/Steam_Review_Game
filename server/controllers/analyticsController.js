const Review = require('../models/Review');
const User = require('../models/User');
const Score = require('../models/Score');

// @desc    Get global statistics
// @route   GET /api/analytics/global
// @access  Admin
const getGlobalStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Total games played (sum of all review analytics totalPlays)
    const gamesPlayedResult = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalGames: { $sum: '$analytics.totalPlays' }
        }
      }
    ]);
    const totalGamesPlayed = gamesPlayedResult.length > 0 ? gamesPlayedResult[0].totalGames : 0;

    // Total correct answers
    const correctAnswersResult = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalCorrect: { $sum: '$analytics.correctAnswers' }
        }
      }
    ]);
    const totalCorrectAnswers = correctAnswersResult.length > 0 ? correctAnswersResult[0].totalCorrect : 0;

    res.json({
      totalUsers,
      totalGamesPlayed,
      totalCorrectAnswers
    });
  } catch (error) {
    console.error('Get global stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all review statistics
// @route   GET /api/analytics/reviews
// @access  Admin
const getReviewStats = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .select('gameName gameImage difficulty analytics')
      .sort({ 'analytics.totalPlays': -1 });

    const reviewStats = reviews.map(review => {
      const totalPlays = review.analytics.totalPlays || 0;
      const correctAnswers = review.analytics.correctAnswers || 0;
      const incorrectAnswers = review.analytics.incorrectAnswers || 0;
      const skips = review.analytics.skips || 0;
      const hints = review.analytics.hints || 0;

      // Calculate percentages
      const successRate = totalPlays > 0 ? ((correctAnswers / totalPlays) * 100).toFixed(1) : 0;
      const skipPercentage = totalPlays > 0 ? ((skips / totalPlays) * 100).toFixed(1) : 0;
      const hintPercentage = totalPlays > 0 ? ((hints / totalPlays) * 100).toFixed(1) : 0;

      return {
        _id: review._id,
        gameName: review.gameName,
        gameImage: review.gameImage,
        difficulty: review.difficulty,
        totalPlays,
        correctAnswers,
        incorrectAnswers,
        skips,
        hints,
        successRate: parseFloat(successRate),
        skipPercentage: parseFloat(skipPercentage),
        hintPercentage: parseFloat(hintPercentage)
      };
    });

    res.json({ reviews: reviewStats });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get specific review statistics
// @route   GET /api/analytics/reviews/:id
// @access  Admin
const getReviewStatsById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).select('gameName gameImage difficulty analytics');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const totalPlays = review.analytics.totalPlays || 0;
    const correctAnswers = review.analytics.correctAnswers || 0;
    const incorrectAnswers = review.analytics.incorrectAnswers || 0;
    const skips = review.analytics.skips || 0;
    const hints = review.analytics.hints || 0;

    const successRate = totalPlays > 0 ? ((correctAnswers / totalPlays) * 100).toFixed(1) : 0;
    const skipPercentage = totalPlays > 0 ? ((skips / totalPlays) * 100).toFixed(1) : 0;
    const hintPercentage = totalPlays > 0 ? ((hints / totalPlays) * 100).toFixed(1) : 0;

    res.json({
      _id: review._id,
      gameName: review.gameName,
      gameImage: review.gameImage,
      difficulty: review.difficulty,
      totalPlays,
      correctAnswers,
      incorrectAnswers,
      skips,
      hints,
      successRate: parseFloat(successRate),
      skipPercentage: parseFloat(skipPercentage),
      hintPercentage: parseFloat(hintPercentage)
    });
  } catch (error) {
    console.error('Get review stats by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get hardest review (lowest success rate)
// @route   GET /api/analytics/hardest
// @access  Admin
const getHardestReview = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      isActive: true,
      'analytics.totalPlays': { $gt: 0 } // Only consider reviews that have been played
    }).select('gameName gameImage difficulty analytics');

    if (reviews.length === 0) {
      return res.json({ message: 'No reviews with plays yet' });
    }

    // Calculate success rate for each and find the hardest
    let hardestReview = null;
    let lowestSuccessRate = 100;

    reviews.forEach(review => {
      const totalPlays = review.analytics.totalPlays || 0;
      const correctAnswers = review.analytics.correctAnswers || 0;
      const successRate = totalPlays > 0 ? (correctAnswers / totalPlays) * 100 : 0;

      if (successRate < lowestSuccessRate) {
        lowestSuccessRate = successRate;
        hardestReview = {
          _id: review._id,
          gameName: review.gameName,
          gameImage: review.gameImage,
          difficulty: review.difficulty,
          totalPlays,
          successRate: parseFloat(successRate.toFixed(1))
        };
      }
    });

    res.json(hardestReview);
  } catch (error) {
    console.error('Get hardest review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset all analytics data
// @route   POST /api/analytics/reset
// @access  Admin
const resetAllAnalytics = async (req, res) => {
  try {
    // Reset analytics for all reviews
    const result = await Review.updateMany(
      {},
      {
        $set: {
          'analytics.totalPlays': 0,
          'analytics.correctAnswers': 0,
          'analytics.incorrectAnswers': 0,
          'analytics.skips': 0,
          'analytics.hints': 0,
          timesPlayed: 0,
          timesCorrect: 0
        }
      }
    );

    console.log(`🔄 Analytics reset complete. Updated ${result.modifiedCount} reviews.`);

    res.json({ 
      message: 'All analytics data has been reset successfully',
      reviewsUpdated: result.modifiedCount
    });
  } catch (error) {
    console.error('Reset analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getGlobalStats,
  getReviewStats,
  getReviewStatsById,
  getHardestReview,
  resetAllAnalytics
};

