import React from 'react';
import { motion } from 'framer-motion';
import { POINTS } from '../utils/gameLogic';

interface JokerButtonsProps {
  onSkip: () => void;
  onHint: () => void;
  canUseHint: boolean;
  currentScore: number;
  disabled?: boolean;
  hintUsed?: boolean;
}

const JokerButtons: React.FC<JokerButtonsProps> = ({
  onSkip,
  onHint,
  canUseHint,
  currentScore,
  disabled,
  hintUsed
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Skip Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSkip}
        disabled={disabled}
        className="flex items-center space-x-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
        <span>Skip Review</span>
        <span className="bg-white/20 px-2 py-1 rounded text-xs">-{POINTS.SKIP_PENALTY} pts</span>
      </motion.button>

      {/* Genre Hint Button */}
      <motion.button
        whileHover={{ scale: canUseHint && !hintUsed ? 1.05 : 1 }}
        whileTap={{ scale: canUseHint && !hintUsed ? 0.95 : 1 }}
        onClick={onHint}
        disabled={disabled || !canUseHint || hintUsed}
        className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>{hintUsed ? 'Hint Used' : 'Show Genre'}</span>
        {!hintUsed && (
          <span className="bg-white/20 px-2 py-1 rounded text-xs">
            {canUseHint ? `-${POINTS.HINT_COST} pts` : `Need ${POINTS.HINT_COST} pts`}
          </span>
        )}
      </motion.button>

      {/* Info text */}
      <div className="text-center sm:text-left">
        <p className="text-xs text-gray-400">
          Current Score: <span className="text-white font-semibold">{currentScore}</span>
        </p>
      </div>
    </div>
  );
};

export default JokerButtons;


