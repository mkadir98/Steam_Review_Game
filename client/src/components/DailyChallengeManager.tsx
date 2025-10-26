import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface Review {
  _id: string;
  gameName: string;
  gameImage?: string;
  difficulty: string;
  reviewImages: {
    en: string[];
    tr: string[];
  };
}

interface DailyChallenge {
  _id: string;
  date: string;
  reviewIds: Review[];
  isActive: boolean;
  createdBy?: {
    username: string;
  };
  createdAt: string;
}

const DailyChallengeManager: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<DailyChallenge | null>(null);
  const [nextChallenge, setNextChallenge] = useState<DailyChallenge | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<DailyChallenge | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    fetchChallenges();
    fetchAllReviews();
  }, []);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      // Fetch current challenge
      try {
        const currentRes = await api.get('/admin/daily-challenges/current');
        setCurrentChallenge(currentRes.data.challenge);
      } catch (error: any) {
        if (error.response?.status !== 404) throw error;
        setCurrentChallenge(null);
      }

      // Fetch next challenge
      try {
        const nextRes = await api.get('/admin/daily-challenges/next');
        setNextChallenge(nextRes.data.challenge);
      } catch (error: any) {
        if (error.response?.status !== 404) throw error;
        setNextChallenge(null);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await api.get('/admin/reviews?limit=100');
      setAllReviews(response.data.reviews.filter((r: any) => r.isActive !== false));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleCreateNew = () => {
    // Set tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTargetDate(tomorrow.toISOString().split('T')[0]);
    setSelectedReviews([]);
    setEditingChallenge(null);
    setShowCreateModal(true);
  };

  const handleEdit = (challenge: DailyChallenge) => {
    setTargetDate(challenge.date);
    setSelectedReviews(challenge.reviewIds.map(r => r._id));
    setEditingChallenge(challenge);
    setShowCreateModal(true);
  };

  const handleToggleReview = (reviewId: string) => {
    if (selectedReviews.includes(reviewId)) {
      setSelectedReviews(selectedReviews.filter(id => id !== reviewId));
    } else {
      if (selectedReviews.length >= 3) {
        toast.error('You can only select 3 reviews');
        return;
      }
      setSelectedReviews([...selectedReviews, reviewId]);
    }
  };

  const handleSave = async () => {
    if (selectedReviews.length !== 3) {
      toast.error('Please select exactly 3 reviews');
      return;
    }

    if (!targetDate) {
      toast.error('Please select a date');
      return;
    }

    try {
      if (editingChallenge) {
        // Update existing
        await api.put(`/admin/daily-challenges/${editingChallenge._id}`, {
          reviewIds: selectedReviews
        });
        toast.success('Challenge updated successfully!');
      } else {
        // Create new
        await api.post('/admin/daily-challenges', {
          date: targetDate,
          reviewIds: selectedReviews
        });
        toast.success('Challenge created successfully!');
      }

      setShowCreateModal(false);
      fetchChallenges();
    } catch (error: any) {
      console.error('Error saving challenge:', error);
      toast.error(error.response?.data?.message || 'Failed to save challenge');
    }
  };

  const handleDelete = async (challengeId: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      await api.delete(`/admin/daily-challenges/${challengeId}`);
      toast.success('Challenge deleted successfully!');
      fetchChallenges();
    } catch (error: any) {
      console.error('Error deleting challenge:', error);
      toast.error(error.response?.data?.message || 'Failed to delete challenge');
    }
  };

  const renderChallengeCard = (challenge: DailyChallenge | null, title: string, isToday: boolean) => {
    if (!challenge) {
      return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-400 mb-4">No challenge set yet</p>
          {!isToday && (
            <button
              onClick={handleCreateNew}
              className="bg-steam-blue hover:bg-steam-light-blue text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Create Challenge
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{challenge.date}</p>
            {challenge.isActive && (
              <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded mt-2">
                Active
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(challenge)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Edit
            </button>
            {!challenge.isActive && (
              <button
                onClick={() => handleDelete(challenge._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {challenge.reviewIds && challenge.reviewIds.length > 0 ? (
            challenge.reviewIds.map((review, index) => (
              <div key={review._id} className="bg-slate-700 rounded-lg p-3 flex items-center space-x-3">
                <span className="text-steam-blue font-bold">#{index + 1}</span>
                {review.gameImage && (
                  <img src={review.gameImage} alt={review.gameName} className="w-12 h-12 object-cover rounded" />
                )}
                <div className="flex-1">
                  <p className="text-white font-semibold">{review.gameName}</p>
                  <p className="text-gray-400 text-sm capitalize">{review.difficulty}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">Loading reviews...</p>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steam-blue mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Daily Challenge Manager</h2>
        <button
          onClick={handleCreateNew}
          className="bg-steam-blue hover:bg-steam-light-blue text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
        >
          + Create New Challenge
        </button>
      </div>

      {/* Current and Next Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        {renderChallengeCard(currentChallenge, "Today's Challenge", true)}
        {renderChallengeCard(nextChallenge, "Next Challenge", false)}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
            </h3>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg w-full border border-slate-600 focus:border-steam-blue focus:outline-none"
                disabled={!!editingChallenge}
              />
            </div>

            {/* Review Selection */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Select 3 Reviews ({selectedReviews.length}/3)
              </label>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {allReviews.map((review) => {
                  const isSelected = selectedReviews.includes(review._id);
                  return (
                    <button
                      key={review._id}
                      onClick={() => handleToggleReview(review._id)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-steam-blue/20 border-steam-blue'
                          : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isSelected && (
                            <span className="text-steam-blue text-xl">✓</span>
                          )}
                        </div>
                        {review.gameImage && (
                          <img
                            src={review.gameImage}
                            alt={review.gameName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-white font-semibold">{review.gameName}</p>
                          <p className="text-gray-400 text-sm capitalize">
                            {review.difficulty}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedReviews.length !== 3}
                className="bg-steam-blue hover:bg-steam-light-blue text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingChallenge ? 'Update' : 'Create'} Challenge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DailyChallengeManager;

