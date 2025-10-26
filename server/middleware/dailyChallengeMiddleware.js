const DailyChallenge = require('../models/DailyChallenge');

/**
 * Middleware to automatically activate today's daily challenge if it exists
 * This runs on every request to ensure the challenge is always up to date
 */
const autoActivateDailyChallenge = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's an active challenge for today
    const activeChallenge = await DailyChallenge.findOne({ date: today, isActive: true });
    
    // If today's challenge is not active, try to activate it
    if (!activeChallenge) {
      const todaysChallenge = await DailyChallenge.findOne({ date: today });
      
      if (todaysChallenge && !todaysChallenge.isActive) {
        // Deactivate all other challenges
        await DailyChallenge.updateMany(
          { isActive: true },
          { isActive: false }
        );
        
        // Activate today's challenge using findByIdAndUpdate to avoid validation
        await DailyChallenge.findByIdAndUpdate(
          todaysChallenge._id,
          { 
            isActive: true, 
            activatedAt: new Date() 
          },
          { runValidators: false }
        );
        
        console.log(`✅ Daily Challenge for ${today} has been automatically activated`);
      }
    }
    
    next();
  } catch (error) {
    // Log error but don't block the request
    console.error('Error in dailyChallengeMiddleware:', error);
    next();
  }
};

module.exports = autoActivateDailyChallenge;

