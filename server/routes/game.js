const express = require('express');
const router = express.Router();
const {
  getDailyChallenge,
  getRandomReview,
  verifyAnswer,
  getHint,
  getGameNames,
  trackSkip
} = require('../controllers/gameController');
const { getTimerInfo } = require('../controllers/dailyChallengeController');

// Optional auth middleware - user can be guest or authenticated
const optionalAuth = (req, res, next) => {
  const authMiddleware = require('../middleware/authMiddleware');
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    // If token exists, use auth middleware
    authMiddleware(req, res, next);
  } else {
    // If no token, continue as guest
    next();
  }
};

// @route   GET /api/game/daily
router.get('/daily', optionalAuth, getDailyChallenge);

// @route   GET /api/game/random
router.get('/random', getRandomReview);

// @route   POST /api/game/verify
router.post('/verify', verifyAnswer);

// @route   GET /api/game/hint/:reviewId
router.get('/hint/:reviewId', getHint);

// @route   GET /api/game/names
router.get('/names', getGameNames);

// @route   GET /api/game/daily/timer
router.get('/daily/timer', getTimerInfo);

// @route   POST /api/game/skip
router.post('/skip', trackSkip);

module.exports = router;


