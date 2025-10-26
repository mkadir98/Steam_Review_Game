const express = require('express');
const router = express.Router();
const {
  getGlobalStats,
  getReviewStats,
  getReviewStatsById,
  getHardestReview,
  resetAllAnalytics
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all routes with auth and admin middleware
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   GET /api/analytics/global
// @desc    Get global statistics
// @access  Admin
router.get('/global', getGlobalStats);

// @route   GET /api/analytics/reviews
// @desc    Get all review statistics
// @access  Admin
router.get('/reviews', getReviewStats);

// @route   GET /api/analytics/reviews/:id
// @desc    Get specific review statistics
// @access  Admin
router.get('/reviews/:id', getReviewStatsById);

// @route   GET /api/analytics/hardest
// @desc    Get hardest review (lowest success rate)
// @access  Admin
router.get('/hardest', getHardestReview);

// @route   POST /api/analytics/reset
// @desc    Reset all analytics data
// @access  Admin
router.post('/reset', resetAllAnalytics);

module.exports = router;

