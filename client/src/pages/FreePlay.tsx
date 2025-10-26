import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import GameBoard from '../components/GameBoard';
import LanguageSelector from '../components/LanguageSelector';

const FreePlay: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { gameState, resetGame } = useGame();
  const [gameStarted, setGameStarted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [playedCount, setPlayedCount] = useState(() => {
    try {
      const stored = localStorage.getItem('playedReviewIds');
      return stored ? JSON.parse(stored).length : 0;
    } catch {
      return 0;
    }
  });

  const handleStartGame = () => {
    resetGame();
    setGameStarted(true);
    setShowSummary(false);
    
    // Update played count when starting
    try {
      const stored = localStorage.getItem('playedReviewIds');
      const count = stored ? JSON.parse(stored).length : 0;
      setPlayedCount(count);
    } catch {
      setPlayedCount(0);
    }
    
    // Warning for limited languages
    const limitedLanguages: { [key: string]: number } = {
      'tr': 3,
      'fr': 1,
      'es': 1,
      'de': 1,
      'it': 0
    };
    
    if (limitedLanguages[selectedLanguage] !== undefined) {
      const count = limitedLanguages[selectedLanguage];
      if (count === 0) {
        toast.error(`⚠️ No reviews available in this language yet! Please switch to English 🇬🇧`, { duration: 6000 });
      } else if (count <= 5) {
        toast.info(`ℹ️ Only ${count} game${count > 1 ? 's' : ''} available in this language. Complete them all!`, { duration: 5000 });
      }
    }
  };

  const handleResetHistory = () => {
    try {
      localStorage.removeItem('playedReviewIds');
      setPlayedCount(0);
      toast.success('Play history cleared! All reviews are now available again.');
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };

  const handleEndGame = async () => {
    if (isAuthenticated && gameState.reviewsCompleted > 0) {
      try {
        await api.post('/scores/submit', {
          gameMode: 'freeplay',
          score: gameState.score,
          reviewsCompleted: gameState.reviewsCompleted,
          reviewsSkipped: gameState.reviewsSkipped,
          hintsUsed: gameState.hintsUsed,
          maxStreak: gameState.maxStreak
        });
        toast.success('Session saved!');
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
    
    // Update played count for display
    try {
      const stored = localStorage.getItem('playedReviewIds');
      const count = stored ? JSON.parse(stored).length : 0;
      setPlayedCount(count);
    } catch {
      setPlayedCount(0);
    }
    
    setShowSummary(true);
    setGameStarted(false);
  };

  if (!gameStarted && !showSummary) {
    return (
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <span className="text-6xl mb-4 block">🎮</span>
          <h1 className="text-4xl font-bold text-white mb-4">Free Play Mode</h1>
          <p className="text-green-100 text-xl mb-8">
            Practice with unlimited random reviews and improve your gaming knowledge!
          </p>
          
          <div className="bg-white/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-white font-bold text-lg mb-4">Free Play Features:</h3>
            <ul className="text-green-100 space-y-2 text-left">
              <li className="flex items-center space-x-2">
                <span>♾️</span>
                <span>Unlimited random reviews</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Same scoring as daily challenge</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📊</span>
                <span>Track your progress</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>💪</span>
                <span>Practice makes perfect!</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Play at your own pace</span>
              </li>
            </ul>
          </div>

          {/* Language Selector */}
          <div className="max-w-md mx-auto mb-6">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          <button
            onClick={handleStartGame}
            className="bg-white text-green-600 px-8 py-4 rounded-xl text-xl font-bold hover:bg-green-100 transition-colors shadow-lg mb-6"
          >
            Start Playing 🚀
          </button>

          {!isAuthenticated && (
            <div className="bg-orange-500/30 border border-orange-400 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <p className="text-white text-sm">
                ⚠️ You're playing as a guest. Your progress won't be saved permanently.
                Log in to track your stats!
              </p>
            </div>
          )}

          {/* Play History Info */}
          {playedCount > 0 && (
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">
                    📝 Played Reviews: {playedCount}
                  </p>
                  <p className="text-green-100 text-xs mt-1">
                    These won't appear again until you reset history
                  </p>
                </div>
                <button
                  onClick={handleResetHistory}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Reset History
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Session Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/20 rounded-2xl p-6">
              <p className="text-blue-100 text-sm mb-2">Final Score</p>
              <p className="text-white text-4xl font-bold">{gameState.score.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-6">
              <p className="text-blue-100 text-sm mb-2">Reviews Completed</p>
              <p className="text-white text-4xl font-bold">{gameState.reviewsCompleted}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-6">
              <p className="text-blue-100 text-sm mb-2">Max Streak</p>
              <p className="text-white text-4xl font-bold">{gameState.maxStreak} 🔥</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-6">
              <p className="text-blue-100 text-sm mb-2">Accuracy</p>
              <p className="text-white text-4xl font-bold">
                {gameState.reviewsCompleted > 0
                  ? Math.round((gameState.reviewsCompleted / (gameState.reviewsCompleted + gameState.reviewsSkipped)) * 100)
                  : 0}%
              </p>
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-bold text-lg mb-4">Session Stats:</h3>
            <div className="grid grid-cols-2 gap-4 text-blue-100">
              <p>Reviews Skipped: <span className="text-white font-semibold">{gameState.reviewsSkipped}</span></p>
              <p>Hints Used: <span className="text-white font-semibold">{gameState.hintsUsed}</span></p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="bg-green-500/30 border border-green-400 rounded-xl p-4 mb-6">
              <p className="text-white text-center">
                ✅ Your session has been saved to your profile!
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartGame}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-100 transition-colors shadow-lg"
            >
              Play Again 🔄
            </button>
            {playedCount > 0 && (
              <button
                onClick={handleResetHistory}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl text-xl font-bold transition-colors shadow-lg"
              >
                Reset History 🔄
              </button>
            )}
            <a
              href="/"
              className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-xl text-xl font-bold transition-colors shadow-lg text-center"
            >
              Back to Home 🏠
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <GameBoard mode="freeplay" language={selectedLanguage} />

      {/* End Session Button */}
      <div className="flex justify-center">
        <button
          onClick={handleEndGame}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default FreePlay;


