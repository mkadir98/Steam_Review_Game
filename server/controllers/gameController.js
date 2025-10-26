const Review = require('../models/Review');
const DailyChallengeModel = require('../models/DailyChallenge');
const User = require('../models/User');
const stringSimilarity = require('string-similarity');

// Helper function to normalize game names for comparison
const normalizeGameName = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/^the\s+/i, ''); // Remove "The" at the beginning
};

// Helper function to get today's date string
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
};

// @desc    Get today's daily challenge
// @route   GET /api/game/daily
// @access  Public
const getDailyChallenge = async (req, res) => {
  try {
    const todayString = getTodayString();
    const { language = 'en' } = req.query;
    
    // Get today's active daily challenge (admin-created)
    const dailyChallenge = await DailyChallengeModel.findOne({ 
      date: todayString,
      isActive: true 
    }).populate('reviewIds');

    // If no daily challenge exists for today
    if (!dailyChallenge) {
      return res.status(404).json({ 
        message: 'No daily challenge available for today. Please check back later!' 
      });
    }

    // Check if user has already completed today's challenge
    let hasCompleted = false;
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user.lastDailyChallengeDate) {
        const lastDate = new Date(user.lastDailyChallengeDate).toISOString().split('T')[0];
        hasCompleted = lastDate === todayString;
      }
      
      // If user hasn't completed today's challenge yet, mark it as completed immediately
      // This prevents users from viewing questions and sharing them
      if (!hasCompleted) {
        user.lastDailyChallengeDate = new Date();
        await user.save();
        console.log(`✅ User ${user.username} started daily challenge for ${todayString}`);
      }
    }

    // Send reviews without game names (for security)
    // Filter out reviews that don't have content in the requested language
    const reviewsData = dailyChallenge.reviewIds
      .filter(review => review.reviewImages[language] && review.reviewImages[language].length > 0)
      .map(review => {
        const languageReviewImages = review.reviewImages[language] || [];
        return {
          id: review._id,
          reviewImages: languageReviewImages,
          gameImage: review.gameImage,
          difficulty: review.difficulty,
          maxReviews: languageReviewImages.length
        };
      });

    if (reviewsData.length < 3) {
      return res.status(400).json({ 
        message: `Not enough reviews available for language: ${language}. Please ensure all selected reviews have images in this language.` 
      });
    }

    res.json({
      date: dailyChallenge.date,
      reviews: reviewsData,
      hasCompleted,
      totalPlayers: dailyChallenge.totalPlayers
    });
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get random review for free play
// @route   GET /api/game/random
// @access  Public
const getRandomReview = async (req, res) => {
  try {
    const { language = 'en', exclude } = req.query;
    const mongoose = require('mongoose');
    
    // Parse exclude list (comma-separated IDs)
    const excludeIds = exclude ? exclude.split(',').filter(id => id.trim()) : [];
    
    console.log('🎲 Random review request - Language:', language, 'Exclude count:', excludeIds.length);
    
    // Build match filter
    const matchFilter = { 
      isActive: true,
      [`reviewImages.${language}.0`]: { $exists: true }
    };
    
    // Exclude already played reviews
    if (excludeIds.length > 0) {
      // Convert string IDs to ObjectIds properly
      const objectIds = excludeIds.map(id => {
        try {
          // Use the correct syntax for newer Mongoose versions
          return new mongoose.Types.ObjectId(id);
        } catch (e) {
          console.error('Invalid ObjectId:', id, e.message);
          return null;
        }
      }).filter(id => id !== null);
      
      if (objectIds.length > 0) {
        matchFilter._id = { $nin: objectIds };
        console.log('🚫 Excluding', objectIds.length, 'reviews');
      }
    }
    
    // Get one random active review that has content in the requested language
    const reviews = await Review.aggregate([
      { $match: matchFilter },
      { $sample: { size: 1 } }
    ]);

    if (reviews.length === 0) {
      // Check if it's because all reviews have been played
      const totalReviews = await Review.countDocuments({ 
        isActive: true,
        [`reviewImages.${language}.0`]: { $exists: true }
      });
      
      console.log('❌ No reviews found. Total available:', totalReviews, 'Excluded:', excludeIds.length);
      
      if (excludeIds.length >= totalReviews && totalReviews > 0) {
        return res.status(404).json({ 
          message: 'All reviews completed!',
          allCompleted: true,
          totalPlayed: excludeIds.length
        });
      }
      
      return res.status(404).json({ 
        message: `No active reviews found for language: ${language}` 
      });
    }

    const review = reviews[0];
    
    console.log('✅ Returning review:', review._id.toString());

    // Increment times played
    // Note: We don't increment totalPlays here anymore. 
    // It will be incremented when the user submits an answer (in verifyAnswer)
    // This ensures totalPlays = correctAnswers + incorrectAnswers

    // Get review images for the requested language
    const languageReviewImages = review.reviewImages[language] || [];

    // Send review without game name
    res.json({
      id: review._id,
      reviewImages: languageReviewImages,
      gameImage: review.gameImage,
      difficulty: review.difficulty,
      maxReviews: languageReviewImages.length
    });
  } catch (error) {
    console.error('Get random review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify answer
// @route   POST /api/game/verify
// @access  Public
const verifyAnswer = async (req, res) => {
  try {
    const { reviewId, answer } = req.body;

    if (!reviewId || !answer) {
      return res.status(400).json({ message: 'Please provide reviewId and answer' });
    }

    // Get review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Normalize both names
    const normalizedAnswer = normalizeGameName(answer);
    const normalizedCorrect = normalizeGameName(review.gameName);

    // Check exact match first
    let isCorrect = normalizedAnswer === normalizedCorrect;

    // If not exact match, check fuzzy match
    if (!isCorrect) {
      const similarity = stringSimilarity.compareTwoStrings(normalizedAnswer, normalizedCorrect);
      // Accept if similarity is > 0.85 (85%)
      isCorrect = similarity > 0.85;
    }

    // Update statistics
    if (isCorrect) {
      await Review.findByIdAndUpdate(reviewId, {
        $inc: { 
          timesCorrect: 1,
          timesPlayed: 1,
          'analytics.correctAnswers': 1,
          'analytics.totalPlays': 1
        }
      });
    } else {
      await Review.findByIdAndUpdate(reviewId, {
        $inc: { 
          timesPlayed: 1,
          'analytics.incorrectAnswers': 1,
          'analytics.totalPlays': 1
        }
      });
    }

    res.json({
      isCorrect,
      correctAnswer: review.gameName,
      genre: review.genre
    });
  } catch (error) {
    console.error('Verify answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get genre hint
// @route   GET /api/game/hint/:reviewId
// @access  Public
const getHint = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Get review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Track hint usage
    await Review.findByIdAndUpdate(reviewId, {
      $inc: { 'analytics.hints': 1 }
    });

    res.json({
      genre: review.genre
    });
  } catch (error) {
    console.error('Get hint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all game names for autocomplete
// @route   GET /api/game/names
// @access  Public
const getGameNames = async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .select('gameName')
      .sort({ gameName: 1 });

    const gameNames = [...new Set(reviews.map(r => r.gameName))];

    res.json({ gameNames });
  } catch (error) {
    console.error('Get game names error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Track skip action
// @route   POST /api/game/skip
// @access  Public
const trackSkip = async (req, res) => {
  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ message: 'Please provide reviewId' });
    }

    // Track skip - also increment totalPlays since skip counts as an attempt
    await Review.findByIdAndUpdate(reviewId, {
      $inc: { 
        'analytics.skips': 1,
        'analytics.totalPlays': 1,
        timesPlayed: 1
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Track skip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDailyChallenge,
  getRandomReview,
  verifyAnswer,
  getHint,
  getGameNames,
  trackSkip
};


