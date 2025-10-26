import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiReviewCardProps {
  reviewImages: string[];
  currentReviewIndex: number;
  gameImage?: string;
  showGenre?: boolean;
  genre?: string;
  maxReviews: number;
  onShowNextReview: () => void;
  canShowNext: boolean;
  mode?: 'daily' | 'freeplay';
  totalReviews?: number;
  currentGameIndex?: number;
  reviewResults?: ('pending' | 'correct' | 'incorrect' | 'skipped')[];
  answerFeedback?: 'correct' | 'incorrect' | null;
  onSubmitAnswer?: (answer: string) => void;
  gameNames?: string[];
  isProcessing?: boolean;
}

const MultiReviewCard: React.FC<MultiReviewCardProps> = ({
  reviewImages,
  currentReviewIndex,
  gameImage,
  showGenre,
  genre,
  maxReviews,
  onShowNextReview,
  canShowNext,
  mode,
  totalReviews = 1,
  currentGameIndex = 0,
  reviewResults = [],
  answerFeedback = null,
  onSubmitAnswer,
  gameNames = [],
  isProcessing = false
}) => {
  // Remove /api from URL for static files
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  
  // Answer input state
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete logic
  useEffect(() => {
    if (answer.length > 1 && gameNames.length > 0) {
      const filtered = gameNames
        .filter(name => name.toLowerCase().includes(answer.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [answer, gameNames]);

  // Clear answer when feedback is shown
  useEffect(() => {
    if (answerFeedback) {
      setAnswer('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [answerFeedback]);
  
  // Determine border and background based on answer feedback
  const getBorderClass = () => {
    if (answerFeedback === 'correct') return 'border-green-500 ring-4 ring-green-500/30';
    if (answerFeedback === 'incorrect') return 'border-red-500 ring-4 ring-red-500/30';
    return 'border-slate-700';
  };

  const getBackgroundClass = () => {
    if (answerFeedback === 'correct') return 'from-green-900/20 to-slate-900';
    if (answerFeedback === 'incorrect') return 'from-red-900/20 to-slate-900';
    return 'from-slate-800 to-slate-900';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && onSubmitAnswer) {
      onSubmitAnswer(answer.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAnswer(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setAnswer(suggestions[selectedIndex]);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: answerFeedback ? [1, 1.02, 1] : 1
      }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${getBackgroundClass()} rounded-2xl p-8 shadow-2xl border-2 ${getBorderClass()} transition-all duration-300 relative`}
    >
      {/* Answer Feedback Overlay */}
      <AnimatePresence>
        {answerFeedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none rounded-2xl overflow-hidden"
          >
            <div className={`${
              answerFeedback === 'correct' 
                ? 'bg-green-500/90' 
                : 'bg-red-500/90'
            } rounded-full w-32 h-32 flex items-center justify-center shadow-2xl`}>
              {answerFeedback === 'correct' ? (
                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steam Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-steam-blue to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Steam Review</p>
            <p className="text-gray-400 text-sm">
              Review {currentReviewIndex + 1} of {maxReviews}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {mode === 'daily' ? (
          <div className="flex items-center space-x-3">
            {Array.from({ length: totalReviews }).map((_, index) => {
              const result = reviewResults[index];
              const isCurrent = index === currentGameIndex;
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                      result === 'correct'
                        ? 'bg-green-600 text-white scale-110'
                        : result === 'incorrect'
                        ? 'bg-red-600 text-white scale-110'
                        : result === 'skipped'
                        ? 'bg-orange-600 text-white scale-110'
                        : isCurrent
                        ? 'bg-steam-blue text-white scale-110 ring-4 ring-steam-light-blue/50'
                        : 'bg-slate-700 text-gray-400'
                    }`}
                  >
                    {result === 'correct' ? (
                      <span>✓</span>
                    ) : result === 'incorrect' ? (
                      <span>✗</span>
                    ) : result === 'skipped' ? (
                      <span>−</span>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex space-x-1">
            {Array.from({ length: maxReviews }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx <= currentReviewIndex
                    ? 'bg-steam-blue'
                    : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Game Image (if provided) */}
      {gameImage && (
        <div className="mb-6 rounded-xl overflow-hidden">
          <img
            src={gameImage}
            alt="Game"
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Review Images with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentReviewIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 mb-4"
        >
          {reviewImages.slice(0, currentReviewIndex + 1).map((imagePath, idx) => {
            const imageUrl = imagePath.startsWith('http') ? imagePath : `${apiUrl}${imagePath}`;
            return (
              <div
                key={idx}
                className={`bg-slate-900/50 rounded-xl border p-2 ${
                  idx === currentReviewIndex
                    ? 'border-steam-blue'
                    : 'border-slate-700'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`Steam Review Screenshot ${idx + 1}`}
                  className="w-full max-h-96 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect width="400" height="200" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239CA3AF"%3EImage not found%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Show Next Review Button */}
      {canShowNext && currentReviewIndex < maxReviews - 1 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onShowNextReview}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all mb-4 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Show Next Review</span>
          <span className="bg-white/20 px-3 py-1 rounded text-sm">
            {maxReviews - currentReviewIndex - 1} remaining
          </span>
        </motion.button>
      )}

      {/* Genre Hint */}
      {showGenre && genre && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-xs text-purple-300 font-semibold uppercase tracking-wide">Hint Used</p>
              <p className="text-white font-bold text-lg">Genre: {genre}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Answer Input */}
      {onSubmitAnswer && (
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => answer.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Type the game name..."
              disabled={isProcessing}
              className="w-full bg-slate-900 border-2 border-slate-600 focus:border-steam-blue rounded-xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isProcessing || !answer.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-steam-blue hover:bg-steam-light-blue text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>

          {/* Autocomplete Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-6 py-3 hover:bg-slate-700 transition-colors ${
                      index === selectedIndex ? 'bg-slate-700' : ''
                    }`}
                  >
                    <span className="text-white">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      )}
    </motion.div>
  );
};

export default MultiReviewCard;

