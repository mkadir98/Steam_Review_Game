const Review = require('../models/Review');

// @desc    Get all reviews (with pagination)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single review
// @route   GET /api/admin/reviews/:id
// @access  Private/Admin
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new review
// @route   POST /api/admin/reviews
// @access  Private/Admin
const createReview = async (req, res) => {
  try {
    const { reviewImages, gameName, genre, gameImage, difficulty } = req.body;

    // Validation
    if (!reviewImages || typeof reviewImages !== 'object') {
      return res.status(400).json({ 
        message: 'Please provide reviewImages as an object with language keys' 
      });
    }
    
    // Check if at least one language has reviews
    const hasReviews = ['en', 'fr', 'es', 'it', 'de', 'tr'].some(lang => 
      reviewImages[lang] && Array.isArray(reviewImages[lang]) && reviewImages[lang].length > 0
    );
    
    if (!hasReviews) {
      return res.status(400).json({ 
        message: 'Please provide at least one review image in any language' 
      });
    }
    
    if (!gameName || !genre) {
      return res.status(400).json({ 
        message: 'Please provide gameName and genre' 
      });
    }

    // Calculate max reviews across all languages
    const maxReviews = Math.max(...['en', 'fr', 'es', 'it', 'de', 'tr'].map(lang => 
      (reviewImages[lang] && Array.isArray(reviewImages[lang])) ? reviewImages[lang].length : 0
    ));

    const review = await Review.create({
      reviewImages,
      gameName,
      genre,
      gameImage: gameImage || '',
      difficulty: difficulty || 'medium',
      maxReviews
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update review
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const { reviewImages, gameName, genre, gameImage, difficulty, isActive } = req.body;

    // Update fields
    if (reviewImages !== undefined && typeof reviewImages === 'object') {
      review.reviewImages = reviewImages;
      // Calculate max reviews across all languages
      const maxReviews = Math.max(...['en', 'fr', 'es', 'it', 'de', 'tr'].map(lang => 
        (reviewImages[lang] && Array.isArray(reviewImages[lang])) ? reviewImages[lang].length : 0
      ));
      review.maxReviews = maxReviews;
    }
    if (gameName !== undefined) review.gameName = gameName;
    if (genre !== undefined) review.genre = genre;
    if (gameImage !== undefined) review.gameImage = gameImage;
    if (difficulty !== undefined) review.difficulty = difficulty;
    if (isActive !== undefined) review.isActive = isActive;

    await review.save();

    res.json(review);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete review
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get review statistics
// @route   GET /api/admin/reviews/stats
// @access  Private/Admin
const getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const activeReviews = await Review.countDocuments({ isActive: true });
    const inactiveReviews = await Review.countDocuments({ isActive: false });

    const totalPlayed = await Review.aggregate([
      { $group: { _id: null, total: { $sum: '$timesPlayed' } } }
    ]);

    const totalCorrect = await Review.aggregate([
      { $group: { _id: null, total: { $sum: '$timesCorrect' } } }
    ]);

    res.json({
      totalReviews,
      activeReviews,
      inactiveReviews,
      totalPlayed: totalPlayed[0]?.total || 0,
      totalCorrect: totalCorrect[0]?.total || 0
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
};


