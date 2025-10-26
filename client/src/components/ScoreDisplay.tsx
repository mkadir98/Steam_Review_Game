import React from 'react';
import { motion } from 'framer-motion';
import { formatScore, getStreakEmoji } from '../utils/gameLogic';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  reviewsCompleted: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, streak, reviewsCompleted }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs font-medium mb-1">Score</p>
            <p className="text-white text-2xl font-bold">{formatScore(score)}</p>
          </div>
          <div className="text-2xl">🎯</div>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs font-medium mb-1">Streak</p>
            <p className="text-white text-2xl font-bold flex items-center space-x-1">
              <span>{streak}</span>
              {streak > 0 && <span className="text-xl">{getStreakEmoji(streak)}</span>}
            </p>
          </div>
          <div className="text-2xl">⚡</div>
        </div>
        {streak > 0 && (
          <p className="text-orange-100 text-xs mt-1">+{streak * 10} bonus</p>
        )}
      </motion.div>

      {/* Reviews Completed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs font-medium mb-1">Completed</p>
            <p className="text-white text-2xl font-bold">{reviewsCompleted}</p>
          </div>
          <div className="text-2xl">✅</div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScoreDisplay;


