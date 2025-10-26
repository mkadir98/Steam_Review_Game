import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ReviewStat {
  _id: string;
  gameName: string;
  gameImage?: string;
  difficulty: string;
  totalPlays: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skips: number;
  hints: number;
  successRate: number;
  skipPercentage: number;
  hintPercentage: number;
}

interface ReviewStatsTableProps {
  reviews: ReviewStat[];
}

type SortKey = 'gameName' | 'totalPlays' | 'successRate' | 'skipPercentage' | 'hintPercentage';

const ReviewStatsTable: React.FC<ReviewStatsTableProps> = ({ reviews }) => {
  const [sortKey, setSortKey] = useState<SortKey>('totalPlays');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-400';
    if (rate >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSuccessRateEmoji = (rate: number) => {
    if (rate >= 70) return '🟢';
    if (rate >= 40) return '🟡';
    return '🔴';
  };

  const ProgressBar: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => (
    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('gameName')}
              >
                Game {sortKey === 'gameName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('totalPlays')}
              >
                Plays {sortKey === 'totalPlays' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('successRate')}
              >
                Success {sortKey === 'successRate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('skipPercentage')}
              >
                Skip Usage {sortKey === 'skipPercentage' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('hintPercentage')}
              >
                Hint Usage {sortKey === 'hintPercentage' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedReviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No review data available yet
                </td>
              </tr>
            ) : (
              sortedReviews.map((review, index) => (
                <motion.tr
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {review.gameImage && (
                        <img 
                          src={review.gameImage} 
                          alt={review.gameName}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="text-white font-semibold">{review.gameName}</p>
                        <p className="text-gray-400 text-xs capitalize">{review.difficulty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-white font-semibold">{review.totalPlays}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className={`font-bold ${getSuccessRateColor(review.successRate)}`}>
                        {review.successRate}%
                      </span>
                      <span>{getSuccessRateEmoji(review.successRate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">{review.skipPercentage}%</span>
                        <span className="text-gray-500">{review.skips} times</span>
                      </div>
                      <ProgressBar percentage={review.skipPercentage} color="bg-orange-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">{review.hintPercentage}%</span>
                        <span className="text-gray-500">{review.hints} times</span>
                      </div>
                      <ProgressBar percentage={review.hintPercentage} color="bg-blue-500" />
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewStatsTable;

