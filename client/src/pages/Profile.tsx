import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  totalScore: number;
  gamesPlayed: number;
  streak: number;
}

interface ScoreHistory {
  _id: string;
  gameMode: string;
  score: number;
  reviewsCompleted: number;
  reviewsSkipped: number;
  hintsUsed: number;
  maxStreak: number;
  date: string;
  createdAt: string;
}

interface UserRank {
  rank: number;
  totalUsers: number;
  totalScore: number;
}

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetUserId = userId || currentUser?.id;

  useEffect(() => {
    if (targetUserId) {
      fetchProfile();
    }
  }, [targetUserId]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      // For now, get current user's data (in a real app, you'd fetch any user's public profile)
      if (currentUser && (!userId || userId === currentUser.id)) {
        setProfile(currentUser as UserProfile);
        
        // Fetch score history
        const historyResponse = await api.get(`/scores/user/${currentUser.id}?limit=10`);
        setScoreHistory(historyResponse.data.scores);

        // Fetch user rank
        const rankResponse = await api.get(`/scores/rank/${currentUser.id}`);
        setUserRank(rankResponse.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
            {profile.email && (
              <p className="text-purple-200">{profile.email}</p>
            )}
          </div>
          {userRank && (
            <div className="text-center bg-white/20 rounded-2xl p-6">
              <p className="text-purple-200 text-sm mb-1">Global Rank</p>
              <p className="text-white text-3xl font-bold">#{userRank.rank}</p>
              <p className="text-purple-200 text-xs mt-1">of {userRank.totalUsers}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 font-medium">Total Score</p>
            <span className="text-3xl">🎯</span>
          </div>
          <p className="text-white text-4xl font-bold">{profile.totalScore.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 font-medium">Games Played</p>
            <span className="text-3xl">🎮</span>
          </div>
          <p className="text-white text-4xl font-bold">{profile.gamesPlayed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 font-medium">Current Streak</p>
            <span className="text-3xl">🔥</span>
          </div>
          <p className="text-white text-4xl font-bold">{profile.streak} days</p>
        </motion.div>
      </div>

      {/* Score History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <span>📊</span>
          <span>Recent Games</span>
        </h2>

        {scoreHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No games played yet</p>
        ) : (
          <div className="space-y-4">
            {scoreHistory.map((score: ScoreHistory, index: number) => (
              <motion.div
                key={score._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900 rounded-xl p-6 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {score.gameMode === 'daily' ? '📅' : '🎮'}
                    </span>
                    <div>
                      <p className="text-white font-semibold text-lg">
                        {score.gameMode === 'daily' ? 'Daily Challenge' : 'Free Play'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(score.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-steam-blue font-bold text-3xl">{score.score.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Completed</p>
                    <p className="text-white font-semibold">✅ {score.reviewsCompleted}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Skipped</p>
                    <p className="text-white font-semibold">⏭️ {score.reviewsSkipped}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Hints Used</p>
                    <p className="text-white font-semibold">💡 {score.hintsUsed}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Max Streak</p>
                    <p className="text-white font-semibold">🔥 {score.maxStreak}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;


