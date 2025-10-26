import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import GameBoard from '../components/GameBoard';
import Leaderboard from '../components/Leaderboard';
import LanguageSelector from '../components/LanguageSelector';
import CountdownTimer from '../components/CountdownTimer';

interface Review {
  id: string;
  reviewImages: string[];
  gameImage?: string;
  difficulty?: string;
}

const DailyChallenge: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { gameState } = useGame();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    // Initial load - don't fetch yet, wait for user to click Start Challenge
    setIsLoading(false);
  }, []);

  const fetchDailyChallenge = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/game/daily', {
        params: { language: selectedLanguage }
      });
      setReviews(response.data.reviews);
      setHasCompleted(response.data.hasCompleted);
      
      if (response.data.hasCompleted) {
        toast('You have already completed today\'s challenge!', { icon: 'ℹ️' });
        setShowLeaderboard(true);
      } else {
        // Start the game if not completed
        setGameStarted(true);
      }
    } catch (error: any) {
      console.error('Error fetching daily challenge:', error);
      toast.error(error.response?.data?.message || 'Failed to load daily challenge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChallenge = () => {
    fetchDailyChallenge();
  };

  const handleSubmitScore = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your score!');
      return;
    }

    try {
      await api.post('/scores/submit', {
        gameMode: 'daily',
        score: gameState.score,
        reviewsCompleted: gameState.reviewsCompleted,
        reviewsSkipped: gameState.reviewsSkipped,
        hintsUsed: gameState.hintsUsed,
        maxStreak: gameState.maxStreak
      });
      
      toast.success('Score submitted successfully!');
      setShowLeaderboard(true);
    } catch (error: any) {
      console.error('Error submitting score:', error);
      toast.error(error.response?.data?.message || 'Failed to submit score');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  if (hasCompleted && !gameStarted) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-4">✅ Challenge Complete!</h2>
          <p className="text-yellow-100 text-xl mb-6">
            You've already completed today's daily challenge.
          </p>
          <p className="text-yellow-100 mb-6">
            Come back tomorrow for a new set of reviews!
          </p>
          
          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 max-w-md mx-auto border border-white/20">
            <p className="text-white text-sm font-semibold mb-2 text-center">⏰ Next Challenge In</p>
            <div className="flex justify-center">
              <CountdownTimer className="justify-center text-white scale-110" />
            </div>
          </div>
          
          {user && (
            <div className="bg-white/20 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-white font-semibold">Your Current Stats</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-yellow-100 text-sm">Total Score</p>
                  <p className="text-white text-2xl font-bold">{user.totalScore.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-yellow-100 text-sm">Streak</p>
                  <p className="text-white text-2xl font-bold">{user.streak} 🔥</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <Leaderboard type="daily" limit={10} />
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-center shadow-2xl max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <span className="text-5xl">📅</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Today's Daily Challenge</h1>
              <p className="text-purple-100 text-sm">Test your gaming knowledge!</p>
            </div>
          </div>
          
          {/* Timer and Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <p className="text-white text-xs font-semibold mb-2">⏰ Resets In</p>
              <CountdownTimer className="justify-center text-white" />
            </div>
            
            {/* Quick Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-left">
              <p className="text-white text-xs font-semibold mb-2">Challenge Info</p>
              <div className="text-purple-100 text-xs space-y-1">
                <p>✅ 3 reviews to guess</p>
                <p>🎯 +100 points each</p>
                <p>🏆 Daily leaderboard</p>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-4">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {!isAuthenticated && (
            <div className="bg-orange-500/30 border border-orange-400 rounded-lg p-3 mb-4 text-sm">
              <p className="text-white">
                <span className="font-bold">Guest Mode:</span> Your score won't be saved. Log in to compete!
              </p>
            </div>
          )}

          {/* Start Button - Big and Prominent */}
          <button
            onClick={handleStartChallenge}
            disabled={isLoading}
            className="w-full bg-white text-purple-600 px-8 py-5 rounded-xl text-2xl font-bold hover:bg-purple-100 transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading...</span>
              </span>
            ) : (
              'START CHALLENGE 🚀'
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-4">🎉 Well Done!</h2>
          <p className="text-green-100 text-xl mb-6">
            You've completed today's challenge!
          </p>
          <div className="bg-white/20 rounded-xl p-6 max-w-md mx-auto mb-4">
            <p className="text-white text-3xl font-bold mb-2">{gameState.score.toLocaleString()}</p>
            <p className="text-green-100">Total Points</p>
          </div>
          
          {/* Countdown Timer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto border border-white/20">
            <p className="text-white text-sm font-semibold mb-2 text-center">⏰ Next Challenge In</p>
            <div className="flex justify-center">
              <CountdownTimer className="justify-center text-white scale-110" />
            </div>
          </div>
        </motion.div>

        <Leaderboard type="daily" limit={10} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <GameBoard mode="daily" reviews={reviews} language={selectedLanguage} />
      
      {isAuthenticated && gameState.reviewsCompleted === reviews.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleSubmitScore}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-all"
          >
            Submit Score & View Leaderboard 🏆
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DailyChallenge;


