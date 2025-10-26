import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import StatsCard from './StatsCard';
import ReviewStatsTable from './ReviewStatsTable';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminAnalytics: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const { analyticsData, isConnected, error } = useAnalytics(token);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetAnalytics = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will reset ALL analytics data to zero!\n\n' +
      'This includes:\n' +
      '• All play counts\n' +
      '• All success rates\n' +
      '• All joker usage statistics\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (!confirmed) return;

    setIsResetting(true);
    try {
      const response = await api.post('/analytics/reset');
      toast.success(`Analytics reset successfully! ${response.data.reviewsUpdated} reviews updated.`);
      // Data will auto-refresh via WebSocket
    } catch (error: any) {
      console.error('Reset analytics error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset analytics');
    } finally {
      setIsResetting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 text-center">
        <p className="text-red-400 font-semibold">Error connecting to analytics server</p>
        <p className="text-gray-400 text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steam-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { globalStats, hardestReview, reviewStats } = analyticsData;

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-400">
          {isConnected ? '🟢 LIVE - Updates every 5 seconds' : '🔴 Disconnected'}
        </span>
      </div>

      {/* Global Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon="👥"
          label="Total Users"
          value={globalStats.totalUsers}
          bgColor="bg-slate-800"
        />
        <StatsCard
          icon="🟢"
          label="Online Users"
          value={globalStats.onlineUsers}
          bgColor="bg-green-600"
        />
        <StatsCard
          icon="🎮"
          label="Games Played"
          value={globalStats.totalGamesPlayed}
          bgColor="bg-blue-600"
        />
        <StatsCard
          icon="✅"
          label="Correct Answers"
          value={globalStats.totalCorrectAnswers}
          bgColor="bg-purple-600"
        />
      </div>

      {/* Hardest Review */}
      {hardestReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/50 rounded-xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">🔥</span>
            <div>
              <h3 className="text-xl font-bold text-white">Hardest Review</h3>
              <p className="text-gray-400 text-sm">Lowest success rate</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {hardestReview.gameImage && (
              <img 
                src={hardestReview.gameImage} 
                alt={hardestReview.gameName}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <p className="text-white font-bold text-2xl">{hardestReview.gameName}</p>
              <p className="text-gray-400 capitalize">{hardestReview.difficulty}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div>
                  <p className="text-red-400 text-2xl font-bold">{hardestReview.successRate}%</p>
                  <p className="text-gray-400 text-xs">Success Rate</p>
                </div>
                <div>
                  <p className="text-white text-xl font-semibold">{hardestReview.totalPlays}</p>
                  <p className="text-gray-400 text-xs">Total Attempts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Review Statistics Table */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Detailed Review Statistics</h3>
              <p className="text-gray-400">
                Comprehensive stats showing joker usage and success rates for each review
              </p>
            </div>
            <button
              onClick={handleResetAnalytics}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg flex items-center space-x-2"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>Reset All Analytics</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
        <ReviewStatsTable reviews={reviewStats} />
      </div>

      {/* Last Updated */}
      <div className="text-center text-gray-500 text-sm">
        Last updated: {new Date(analyticsData.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AdminAnalytics;

