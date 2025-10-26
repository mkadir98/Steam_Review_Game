import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import DailyChallengeManager from '../components/DailyChallengeManager';
import AdminAnalytics from '../components/AdminAnalytics';

interface Review {
  _id: string;
  reviewImages: {
    en: string[];
    fr: string[];
    es: string[];
    it: string[];
    de: string[];
    tr: string[];
  };
  gameName: string;
  genre: string;
  gameImage?: string;
  difficulty: string;
  isActive: boolean;
  timesPlayed: number;
  timesCorrect: number;
  createdAt: string;
  maxReviews?: number;
}

interface Stats {
  totalReviews: number;
  activeReviews: number;
  inactiveReviews: number;
  totalPlayed: number;
  totalCorrect: number;
}

const AdminPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    reviewImages: {
      en: ['', '', ''],
      fr: ['', '', ''],
      es: ['', '', ''],
      it: ['', '', ''],
      de: ['', '', ''],
      tr: ['', '', '']
    },
    gameName: '',
    genre: '',
    gameImage: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

  // Track uploading state per language and slot
  const [uploadingStates, setUploadingStates] = useState<{[key: string]: boolean}>({});
  
  const [activeTab, setActiveTab] = useState<'en' | 'fr' | 'es' | 'it' | 'de' | 'tr'>('en');
  const [mainTab, setMainTab] = useState<'reviews' | 'daily-challenges' | 'analytics'>('reviews');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchReviews();
      fetchStats();
    }
  }, [user]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/reviews?limit=50');
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/reviews/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleImageUpload = async (file: File, lang: string, index: number) => {
    const uploadKey = `${lang}-${index}`;
    setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append('image', file);

      const response = await api.post('/admin/reviews/upload-image', formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update form data with the returned image path
      const newReviewImages = { ...formData.reviewImages };
      newReviewImages[lang as keyof typeof newReviewImages][index] = response.data.imagePath;
      setFormData({ ...formData, reviewImages: newReviewImages });

      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty review images for each language
    const filteredReviewImages: any = {};
    let hasAnyReview = false;
    
    languages.forEach(lang => {
      const langReviewImages = formData.reviewImages[lang.code as keyof typeof formData.reviewImages]
        .filter((path: string) => path.trim() !== '');
      
      if (langReviewImages.length > 0) {
        filteredReviewImages[lang.code] = langReviewImages;
        hasAnyReview = true;
      }
    });
    
    if (!hasAnyReview) {
      toast.error('Please upload at least one review image in any language');
      return;
    }
    
    const dataToSend = {
      ...formData,
      reviewImages: filteredReviewImages
    };
    
    try {
      if (editingReview) {
        await api.put(`/admin/reviews/${editingReview._id}`, dataToSend);
        toast.success('Review updated successfully!');
      } else {
        await api.post('/admin/reviews', dataToSend);
        toast.success('Review added successfully!');
      }
      
      setShowAddModal(false);
      setEditingReview(null);
      setFormData({
        reviewImages: {
          en: ['', '', ''],
          fr: ['', '', ''],
          es: ['', '', ''],
          it: ['', '', ''],
          de: ['', '', ''],
          tr: ['', '', '']
        },
        gameName: '',
        genre: '',
        gameImage: '',
        difficulty: 'medium'
      });
      setActiveTab('en');
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      console.error('Error saving review:', error);
      toast.error(error.response?.data?.message || 'Failed to save review');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    
    // Prepare review images for each language
    const reviewImagesData: any = {
      en: ['', '', ''],
      fr: ['', '', ''],
      es: ['', '', ''],
      it: ['', '', ''],
      de: ['', '', ''],
      tr: ['', '', '']
    };
    
    // Fill with existing data
    languages.forEach(lang => {
      const langReviewImages = review.reviewImages[lang.code as keyof typeof review.reviewImages] || [];
      reviewImagesData[lang.code] = [...langReviewImages, '', '', ''].slice(0, 3);
    });
    
    setFormData({
      reviewImages: reviewImagesData,
      gameName: review.gameName,
      genre: review.genre,
      gameImage: review.gameImage || '',
      difficulty: review.difficulty as 'easy' | 'medium' | 'hard'
    });
    setActiveTab('en');
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('Review deleted successfully!');
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleToggleActive = async (review: Review) => {
    try {
      await api.put(`/admin/reviews/${review._id}`, {
        isActive: !review.isActive
      });
      toast.success(`Review ${review.isActive ? 'deactivated' : 'activated'}!`);
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Error toggling review status:', error);
      toast.error('Failed to update review status');
    }
  };

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-purple-100">Manage reviews and daily challenges</p>
      </motion.div>

      {/* Main Tabs */}
      <div className="flex space-x-2 border-b border-slate-700">
        <button
          onClick={() => setMainTab('reviews')}
          className={`px-6 py-3 font-semibold transition-colors ${
            mainTab === 'reviews'
              ? 'text-steam-blue border-b-2 border-steam-blue'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Reviews Management
        </button>
        <button
          onClick={() => setMainTab('daily-challenges')}
          className={`px-6 py-3 font-semibold transition-colors ${
            mainTab === 'daily-challenges'
              ? 'text-steam-blue border-b-2 border-steam-blue'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Daily Challenges
        </button>
        <button
          onClick={() => setMainTab('analytics')}
          className={`px-6 py-3 font-semibold transition-colors ${
            mainTab === 'analytics'
              ? 'text-steam-blue border-b-2 border-steam-blue'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {mainTab === 'analytics' ? (
        <AdminAnalytics />
      ) : mainTab === 'reviews' ? (
        <>
          {/* Stats */}
          {stats && (
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
            <p className="text-white text-3xl font-bold">{stats.totalReviews}</p>
          </div>
          <div className="bg-green-600 rounded-xl p-6">
            <p className="text-green-100 text-sm mb-1">Active</p>
            <p className="text-white text-3xl font-bold">{stats.activeReviews}</p>
          </div>
          <div className="bg-red-600 rounded-xl p-6">
            <p className="text-red-100 text-sm mb-1">Inactive</p>
            <p className="text-white text-3xl font-bold">{stats.inactiveReviews}</p>
          </div>
          <div className="bg-blue-600 rounded-xl p-6">
            <p className="text-blue-100 text-sm mb-1">Times Played</p>
            <p className="text-white text-3xl font-bold">{stats.totalPlayed}</p>
          </div>
          <div className="bg-purple-600 rounded-xl p-6">
            <p className="text-purple-100 text-sm mb-1">Correct Guesses</p>
            <p className="text-white text-3xl font-bold">{stats.totalCorrect}</p>
          </div>
        </div>
      )}

      {/* Add Review Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingReview(null);
            setFormData({
              reviewImages: {
                en: ['', '', ''],
                fr: ['', '', ''],
                es: ['', '', ''],
                it: ['', '', ''],
                de: ['', '', ''],
                tr: ['', '', '']
              },
              gameName: '',
              genre: '',
              gameImage: '',
              difficulty: 'medium'
            });
            setActiveTab('en');
            setShowAddModal(true);
          }}
          className="bg-steam-blue hover:bg-steam-light-blue text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg"
        >
          + Add New Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">All Reviews</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-steam-blue mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet. Add your first review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`bg-slate-900 rounded-xl p-6 border ${
                  review.isActive ? 'border-green-500/30' : 'border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{review.gameName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        review.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {review.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        {review.difficulty}
                      </span>
                    </div>
                    <div className="space-y-3 mb-2">
                      {languages.map(lang => {
                        const langReviewImages = review.reviewImages[lang.code as keyof typeof review.reviewImages] || [];
                        if (langReviewImages.length === 0) return null;
                        
                        // Remove /api from URL for static files
                        const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
                        
                        return (
                          <div key={lang.code} className="border-l-2 border-indigo-500 pl-3">
                            <p className="text-indigo-400 font-semibold text-xs mb-1">
                              {lang.flag} {lang.name} ({langReviewImages.length} image{langReviewImages.length > 1 ? 's' : ''})
                            </p>
                            <div className="flex gap-2 flex-wrap ml-2">
                              {langReviewImages.map((imagePath, idx) => {
                                const imageUrl = imagePath.startsWith('http') ? imagePath : `${apiUrl}${imagePath}`;
                                return (
                                  <img
                                    key={idx}
                                    src={imageUrl}
                                    alt={`Review ${idx + 1}`}
                                    className="w-24 h-16 object-cover rounded border border-purple-500/50"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="60"%3E%3Crect width="100" height="60" fill="%23374151"/%3E%3C/svg%3E';
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-gray-400 text-sm">Genre: {review.genre}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Played: {review.timesPlayed} times | Correct: {review.timesCorrect} times
                      {review.timesPlayed > 0 && ` (${Math.round((review.timesCorrect / review.timesPlayed) * 100)}%)`}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(review)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        review.isActive
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {review.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

          {/* Add/Edit Modal */}
          {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 my-8 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900"
          >
            <div className="sticky top-0 bg-slate-800 pb-4 mb-2 border-b border-slate-700 -mx-8 px-8 -mt-8 pt-8 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingReview ? 'Edit Review' : 'Add New Review'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingReview(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Game Name *
                </label>
                <input
                  type="text"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-steam-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Steam Review Images * (Upload screenshots in different languages)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  💡 Upload 1-3 review screenshots per language. Players will see them one by one (-25 points per additional review).
                </p>
                
                {/* Language Tabs */}
                <div className="flex space-x-1 mb-3 overflow-x-auto">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setActiveTab(lang.code as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        activeTab === lang.code
                          ? 'bg-steam-blue text-white'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>

                {/* Review Image Inputs for Active Language */}
                <div className="space-y-3">
                  {[0, 1, 2].map(idx => {
                    const uploadKey = `${activeTab}-${idx}`;
                    const isUploading = uploadingStates[uploadKey];
                    const currentImagePath = formData.reviewImages[activeTab][idx];
                    // Remove /api from URL for static files
                    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
                    const imageUrl = currentImagePath && (currentImagePath.startsWith('http') ? currentImagePath : `${baseUrl}${currentImagePath}`);
                    
                    return (
                      <div key={idx}>
                        <label className="block text-xs text-purple-400 font-semibold mb-1">
                          Review Image {idx + 1} {idx === 0 ? '(Required for first)' : '(Optional)'}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, activeTab, idx);
                              }
                            }}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-steam-blue file:text-white hover:file:bg-steam-light-blue cursor-pointer"
                            disabled={isUploading}
                          />
                          {isUploading && (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-steam-blue"></div>
                          )}
                        </div>
                        {currentImagePath && (
                          <div className="mt-2 relative">
                            <img 
                              src={imageUrl} 
                              alt={`Review ${idx + 1} preview`}
                              className="w-full max-h-32 object-contain rounded border border-slate-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = { ...formData.reviewImages };
                                newImages[activeTab][idx] = '';
                                setFormData({ ...formData, reviewImages: newImages });
                              }}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Genre *
                </label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-steam-blue"
                  placeholder="e.g., Action RPG, FPS, Strategy"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Game Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.gameImage}
                  onChange={(e) => setFormData({ ...formData, gameImage: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-steam-blue"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-steam-blue"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 sticky bottom-0 bg-slate-800 pb-4 -mx-8 px-8 -mb-8 border-t border-slate-700 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-steam-blue hover:bg-steam-light-blue text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {editingReview ? 'Update Review' : 'Add Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingReview(null);
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
        </>
      ) : (
        <DailyChallengeManager />
      )}
    </div>
  );
};

export default AdminPanel;


