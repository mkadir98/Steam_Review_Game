import React from 'react';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  reviewImage: string;
  gameImage?: string;
  showGenre?: boolean;
  genre?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ reviewImage, gameImage, showGenre, genre }) => {
  // Remove /api from URL for static files
  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
  const imageUrl = reviewImage.startsWith('http') ? reviewImage : `${baseUrl}${reviewImage}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700"
    >
      {/* Steam Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-steam-blue to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-lg">Steam Review</p>
          <p className="text-gray-400 text-sm">Community Review</p>
        </div>
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

      {/* Review Screenshot Image */}
      <div className="bg-slate-900/50 rounded-xl mb-4 border border-slate-700 p-2">
        <img
          src={imageUrl}
          alt="Steam Review Screenshot"
          className="w-full max-h-96 object-contain rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect width="400" height="200" fill="%23374151"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239CA3AF"%3EImage not found%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>

      {/* Genre Hint */}
      {showGenre && genre && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-4"
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
    </motion.div>
  );
};

export default ReviewCard;


