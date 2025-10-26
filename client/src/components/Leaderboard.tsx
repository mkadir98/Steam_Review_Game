import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score?: number;
  totalScore?: number;
  reviewsCompleted?: number;
  gamesPlayed?: number;
  maxStreak?: number;
  streak?: number;
}

interface LeaderboardProps {
  type: 'daily' | 'alltime';
  limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ type, limit = 10 }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [type, limit]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === 'daily' 
        ? `/scores/leaderboard/daily?limit=${limit}`
        : `/scores/leaderboard/alltime?limit=${limit}`;
      
      const response = await api.get(endpoint);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-slate-600 to-slate-700';
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🎮';
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h3 className="text-2xl font-bold text-white">
          {type === 'daily' ? "Today's Leaderboard" : 'All-Time Leaderboard'}
        </h3>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No scores yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={`${entry.username}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-r ${getRankColor(entry.rank)} rounded-xl p-4 flex items-center justify-between shadow-lg`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getRankEmoji(entry.rank)}</div>
                <div>
                  <p className="text-white font-bold text-lg">{entry.username}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    {type === 'daily' ? (
                      <>
                        <span className="text-white/80">
                          ✅ {entry.reviewsCompleted} reviews
                        </span>
                        {entry.maxStreak && entry.maxStreak > 0 && (
                          <span className="text-white/80">
                            🔥 {entry.maxStreak} streak
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-white/80">
                          🎮 {entry.gamesPlayed} games
                        </span>
                        {entry.streak && entry.streak > 0 && (
                          <span className="text-white/80">
                            🔥 {entry.streak} day streak
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-2xl">
                  {type === 'daily' 
                    ? entry.score?.toLocaleString() 
                    : entry.totalScore?.toLocaleString()}
                </p>
                <p className="text-white/60 text-xs">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;


