const express = require('express');
const router = express.Router();
const {
  submitScore,
  getDailyLeaderboard,
  getAllTimeLeaderboard,
  getUserScores,
  getUserRank
} = require('../controllers/scoreController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/scores/submit
router.post('/submit', authMiddleware, submitScore);

// @route   GET /api/scores/leaderboard/daily
router.get('/leaderboard/daily', getDailyLeaderboard);

// @route   GET /api/scores/leaderboard/alltime
router.get('/leaderboard/alltime', getAllTimeLeaderboard);

// @route   GET /api/scores/user/:userId
router.get('/user/:userId', getUserScores);

// @route   GET /api/scores/rank/:userId
router.get('/rank/:userId', getUserRank);

module.exports = router;


