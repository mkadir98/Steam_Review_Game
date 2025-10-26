import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Leaderboard from '../components/Leaderboard';
import CountdownTimer from '../components/CountdownTimer';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Can You Guess <span className="text-steam-blue">The Game</span>?
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Test your gaming knowledge by guessing games from real Steam reviews!
          Play daily challenges or practice in free play mode.
        </p>
      </motion.div>

      {/* Game Mode Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/daily"
            className="block bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform group"
          >
            {/* Countdown Timer - Large and Prominent */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              <p className="text-white text-xl font-bold mb-4 text-center">⏰ Next Challenge Resets In</p>
              <div className="flex justify-center">
                <CountdownTimer className="justify-center text-white" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">Daily Challenge</h2>
              <span className="text-5xl">📅</span>
            </div>
            <p className="text-purple-100 mb-6">
              A new set of 3 reviews every day! Compete with players worldwide and
              climb the daily leaderboard.
            </p>
            <div className="space-y-2 text-purple-100 mb-4">
              <p className="flex items-center space-x-2">
                <span>✅</span>
                <span>3 reviews per day</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>🏆</span>
                <span>Daily leaderboard</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>⏰</span>
                <span>Resets at midnight UTC</span>
              </p>
            </div>

            <div className="bg-white/20 rounded-xl p-4 text-white text-center font-semibold group-hover:bg-white/30 transition-colors">
              Start Daily Challenge →
            </div>
          </Link>
        </motion.div>

        {/* Free Play */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/freeplay"
            className="block bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform group"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">Free Play</h2>
              <span className="text-5xl">🎮</span>
            </div>
            <p className="text-green-100 mb-6">
              Practice mode with unlimited random reviews. Perfect for improving
              your gaming knowledge or just having fun!
            </p>
            <div className="space-y-2 text-green-100">
              <p className="flex items-center space-x-2">
                <span>♾️</span>
                <span>Unlimited reviews</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>🎯</span>
                <span>Practice mode</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📊</span>
                <span>Track your progress</span>
              </p>
            </div>
            <div className="mt-6 bg-white/20 rounded-xl p-4 text-white text-center font-semibold group-hover:bg-white/30 transition-colors">
              Start Free Play →
            </div>
          </Link>
        </motion.div>
      </div>

      {/* How to Play */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800 rounded-3xl p-8 border border-slate-700 max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <span>📖</span>
          <span>How to Play</span>
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-steam-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Read the Review</h4>
                <p className="text-gray-400 text-sm">
                  You'll see a real Steam review from a game
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-steam-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Guess the Game</h4>
                <p className="text-gray-400 text-sm">
                  Type your answer in the text box with autocomplete help
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-steam-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Use Jokers</h4>
                <p className="text-gray-400 text-sm">
                  Skip (-30 pts) or show genre hint (-20 pts)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-steam-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Build Streaks</h4>
                <p className="text-gray-400 text-sm">
                  Get bonus points for consecutive correct answers
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Leaderboards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Leaderboard type="daily" limit={5} />
        <Leaderboard type="alltime" limit={5} />
      </div>
    </div>
  );
};

export default Home;


