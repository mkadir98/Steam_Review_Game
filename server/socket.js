const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Review = require('./models/Review');

// Store online users
const onlineUsers = new Map();

const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      // Check if user is admin
      if (!user.isAdmin) {
        return next(new Error('Admin access required'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Admin connected: ${socket.user.username}`);

    // Send initial stats immediately
    broadcastStats(io);

    socket.on('disconnect', () => {
      console.log(`Admin disconnected: ${socket.user.username}`);
    });
  });

  // Broadcast stats every 5 seconds
  setInterval(() => {
    broadcastStats(io);
  }, 5000);
};

const broadcastStats = async (io) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();

    // Count online users (connected sockets)
    const onlineUsersCount = io.engine.clientsCount;

    // Total games played
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

    // Get hardest review
    const reviews = await Review.find({ 
      isActive: true,
      'analytics.totalPlays': { $gt: 0 }
    }).select('gameName gameImage difficulty analytics');

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

    // Get all review stats
    const allReviews = await Review.find({ isActive: true })
      .select('gameName gameImage difficulty analytics')
      .sort({ 'analytics.totalPlays': -1 })
      .limit(50); // Limit to top 50 to avoid huge payloads

    const reviewStats = allReviews.map(review => {
      const totalPlays = review.analytics.totalPlays || 0;
      const correctAnswers = review.analytics.correctAnswers || 0;
      const incorrectAnswers = review.analytics.incorrectAnswers || 0;
      const skips = review.analytics.skips || 0;
      const hints = review.analytics.hints || 0;

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

    // Emit stats update
    io.emit('stats-update', {
      globalStats: {
        totalUsers,
        onlineUsers: onlineUsersCount,
        totalGamesPlayed,
        totalCorrectAnswers
      },
      hardestReview,
      reviewStats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error broadcasting stats:', error);
  }
};

module.exports = { initializeSocket };

