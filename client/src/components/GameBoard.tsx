import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import toast from 'react-hot-toast';
import MultiReviewCard from './MultiReviewCard';
import JokerButtons from './JokerButtons';
import ScoreDisplay from './ScoreDisplay';
import { calculateScore, canUseHint, useHint, POINTS } from '../utils/gameLogic';
import { useGame } from '../context/GameContext';

interface Review {
  id: string;
  reviewImages: string[];
  gameImage?: string;
  difficulty?: string;
  maxReviews?: number;
}

interface GameBoardProps {
  mode: 'daily' | 'freeplay';
  reviews?: Review[];
  language?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ mode, reviews: initialReviews, language = 'en' }) => {
  const { gameState, updateScore, updateStreak, incrementCompleted, incrementSkipped, incrementHintsUsed, resetGame } = useGame();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentReviewTextIndex, setCurrentReviewTextIndex] = useState(0); // For multiple reviews per game
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [showGenre, setShowGenre] = useState(false);
  const [genre, setGenre] = useState('');
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [playedReviewIds, setPlayedReviewIds] = useState<string[]>(() => {
    // Load played review IDs from localStorage on mount (for freeplay mode)
    if (mode === 'freeplay') {
      try {
        const stored = localStorage.getItem('playedReviewIds');
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error loading played reviews from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  const [reviewResults, setReviewResults] = useState<('pending' | 'correct' | 'incorrect' | 'skipped')[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Save played review IDs to localStorage whenever they change (for freeplay)
  useEffect(() => {
    if (mode === 'freeplay' && playedReviewIds.length > 0) {
      try {
        localStorage.setItem('playedReviewIds', JSON.stringify(playedReviewIds));
      } catch (error) {
        console.error('Error saving played reviews to localStorage:', error);
      }
    }
  }, [playedReviewIds, mode]);

  useEffect(() => {
    resetGame();
    fetchGameNames();
    
    if (mode === 'freeplay' && !initialReviews) {
      fetchRandomReview();
    } else if (initialReviews && initialReviews.length > 0) {
      // Initialize review results for daily mode
      setReviewResults(initialReviews.map(() => 'pending'));
    }
  }, [mode]);

  const fetchGameNames = async () => {
    try {
      const response = await api.get('/game/names');
      setGameNames(response.data.gameNames);
    } catch (error) {
      console.error('Error fetching game names:', error);
    }
  };

  const fetchRandomReview = async (additionalExcludeId?: string) => {
    try {
      // ALWAYS read from localStorage to get the most up-to-date list
      let currentPlayedIds: string[] = [];
      try {
        const stored = localStorage.getItem('playedReviewIds');
        if (stored) {
          currentPlayedIds = JSON.parse(stored);
          console.log('📋 Read from localStorage:', currentPlayedIds.length, 'played reviews');
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
      
      // Include the additional ID if provided, but avoid duplicates
      let excludeIds = additionalExcludeId 
        ? [...currentPlayedIds, additionalExcludeId]
        : currentPlayedIds;
      
      // Remove duplicates using Set
      excludeIds = [...new Set(excludeIds)];
      
      console.log('🎲 Fetching random review... Excluding:', excludeIds.length, 'reviews');
      console.log('🚫 Excluded IDs:', excludeIds.join(', ') || 'none');
      
      const response = await api.get('/game/random', {
        params: { 
          language,
          exclude: excludeIds.join(',')
        }
      });
      
      if (!response.data || !response.data.reviewImages || response.data.reviewImages.length === 0) {
        throw new Error('No review data received');
      }
      
      console.log('✨ New review fetched:', response.data.id);
      
      // Check if we accidentally got a duplicate
      if (excludeIds.includes(response.data.id)) {
        console.error('⚠️ WARNING: Received a duplicate review!', response.data.id);
        console.error('This should not happen. Server may have an issue.');
      }
      
      setReviews([response.data]);
      setCurrentReviewIndex(0);
      setCurrentReviewTextIndex(0);
      setShowGenre(false);
    } catch (error: any) {
      console.error('Error fetching review:', error);
      console.error('Error details:', error.response?.data);
      
      const errorData = error.response?.data;
      
      // Check if all reviews are completed
      if (errorData?.allCompleted) {
        console.log('🎉 All reviews completed!');
        setGameFinished(true);
        return;
      }
      
      const errorMessage = errorData?.message || 'Failed to load review';
      toast.error(errorMessage, { duration: 5000 });
      
      // If no reviews available in this language, suggest switching language
      if (error.response?.status === 404 || errorMessage.includes('No active reviews')) {
        toast.error(
          'No more reviews available in this language! Try switching to English 🇬🇧',
          { duration: 8000 }
        );
      }
    }
  };

  const handleShowNextReview = () => {
    const currentReview = reviews[currentReviewIndex];
    const maxReviews = currentReview.maxReviews || currentReview.reviewImages.length;

    if (currentReviewTextIndex < maxReviews - 1) {
      // Apply penalty for showing next review
      const newScore = Math.max(0, gameState.score - POINTS.NEXT_REVIEW_PENALTY);
      updateScore(newScore);
      setCurrentReviewTextIndex(currentReviewTextIndex + 1);
      toast(`Next review shown! -${POINTS.NEXT_REVIEW_PENALTY} points`, { icon: 'ℹ️' });
    }
  };

  const handleSkip = async () => {
    const currentReview = reviews[currentReviewIndex];
    const reviewId = currentReview?.id;
    
    // Track skip analytics
    if (reviewId) {
      try {
        await api.post('/game/skip', { reviewId });
      } catch (error) {
        console.error('Error tracking skip:', error);
      }
    }
    
    if (mode === 'daily') {
      // In daily mode, skip to next review
      if (currentReviewIndex < reviews.length - 1) {
        const { newScore } = calculateScore(false, gameState.score, gameState.streak, true);
        updateScore(newScore);
        updateStreak(0);
        incrementSkipped();
        
        // Update review result
        const newResults = [...reviewResults];
        newResults[currentReviewIndex] = 'skipped';
        setReviewResults(newResults);
        
        setCurrentReviewIndex(currentReviewIndex + 1);
        setCurrentReviewTextIndex(0);
        setShowGenre(false);
        toast.error('Review skipped! -30 points');
      } else {
        toast('No more reviews!', { icon: 'ℹ️' });
      }
    } else {
      // In free play, get new review
      const { newScore } = calculateScore(false, gameState.score, gameState.streak, true);
      updateScore(newScore);
      updateStreak(0);
      incrementSkipped();
      
      // Add current review to played list even if skipped
      if (reviewId && !playedReviewIds.includes(reviewId)) {
        console.log('Adding skipped review to played list:', reviewId);
        setPlayedReviewIds([...playedReviewIds, reviewId]);
      }
      
      // Pass the current review ID to exclude it immediately
      await fetchRandomReview(reviewId);
      toast.error('Review skipped! -30 points');
    }
  };

  const handleHint = async () => {
    if (!canUseHint(gameState.score)) {
      toast.error(`You need at least 20 points to use a hint!`);
      return;
    }

    if (showGenre) {
      toast('Hint already used!', { icon: 'ℹ️' });
      return;
    }

    try {
      const currentReview = reviews[currentReviewIndex];
      const response = await api.get(`/game/hint/${currentReview.id}`);
      
      const newScore = useHint(gameState.score);
      updateScore(newScore);
      incrementHintsUsed();
      setGenre(response.data.genre);
      setShowGenre(true);
      
      toast.success(`Hint used! Genre: ${response.data.genre} (-20 points)`);
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to get hint');
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const currentReview = reviews[currentReviewIndex];
      const reviewId = currentReview.id; // Define reviewId at the top
      
      const response = await api.post('/game/verify', {
        reviewId: reviewId,
        answer
      });

      const { isCorrect, correctAnswer } = response.data;

      if (isCorrect) {
        const { newScore, newStreak, pointsEarned } = calculateScore(
          true,
          gameState.score,
          gameState.streak,
          false
        );
        
        updateScore(newScore);
        updateStreak(newStreak);
        incrementCompleted();
        
        // Update review result
        if (mode === 'daily') {
          const newResults = [...reviewResults];
          newResults[currentReviewIndex] = 'correct';
          setReviewResults(newResults);
        }
        
        // Show visual feedback
        setAnswerFeedback('correct');
        toast.success(`Correct! +${pointsEarned} points! 🎉`);

        // Add to played list for freeplay mode (IMMEDIATELY)
        if (mode === 'freeplay') {
          if (!playedReviewIds.includes(reviewId)) {
            console.log('✅ Adding to played list:', reviewId);
            const newPlayedIds = [...playedReviewIds, reviewId];
            setPlayedReviewIds(newPlayedIds);
            // Also save to localStorage immediately
            try {
              localStorage.setItem('playedReviewIds', JSON.stringify(newPlayedIds));
              console.log('💾 Saved to localStorage. Total played:', newPlayedIds.length);
            } catch (error) {
              console.error('Error saving to localStorage:', error);
            }
          }
        }

        // Move to next review or finish
        setTimeout(() => {
          console.log('Moving to next review...', { mode, currentReviewIndex, totalReviews: reviews.length });
          
          // Clear feedback
          setAnswerFeedback(null);
          
          if (mode === 'daily') {
            if (currentReviewIndex < reviews.length - 1) {
              setCurrentReviewIndex(currentReviewIndex + 1);
              setCurrentReviewTextIndex(0);
              setShowGenre(false);
            } else {
              setGameFinished(true);
            }
          } else {
            // Free play mode - fetch new review, excluding the one we just played
            console.log('🎮 Fetching random review, excluding:', reviewId);
            fetchRandomReview(reviewId);
          }
          setIsProcessing(false);
        }, 1500);
      } else {
        updateStreak(0);
        
        // Update review result
        if (mode === 'daily') {
          const newResults = [...reviewResults];
          newResults[currentReviewIndex] = 'incorrect';
          setReviewResults(newResults);
        }
        
        // Show visual feedback
        setAnswerFeedback('incorrect');
        toast.error(`Wrong! The answer was: ${correctAnswer}`);
        
        setTimeout(() => {
          // Clear feedback
          setAnswerFeedback(null);
          
          if (mode === 'daily') {
            if (currentReviewIndex < reviews.length - 1) {
              setCurrentReviewIndex(currentReviewIndex + 1);
              setCurrentReviewTextIndex(0);
              setShowGenre(false);
            } else {
              setGameFinished(true);
            }
          } else {
            // Wrong answer in freeplay - just get a new review without adding to played list
            fetchRandomReview();
          }
          setIsProcessing(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error verifying answer:', error);
      toast.error('Failed to verify answer');
      setIsProcessing(false);
    }
  };

  if (gameFinished) {
    const isFreePlay = mode === 'freeplay';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className={`bg-gradient-to-br ${isFreePlay ? 'from-purple-600 to-pink-600' : 'from-green-600 to-emerald-600'} rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            {isFreePlay ? '🏆 Perfect Session!' : '🎉 Challenge Complete!'}
          </h2>
          <p className="text-white/90 text-xl mb-8">
            {isFreePlay 
              ? `You completed all ${playedReviewIds.length} games in this language! 🎮`
              : "You've finished today's daily challenge!"
            }
          </p>
          <ScoreDisplay
            score={gameState.score}
            streak={gameState.streak}
            reviewsCompleted={gameState.reviewsCompleted}
          />
          <div className="mt-8 space-y-2 text-white">
            <p>Reviews Completed: {gameState.reviewsCompleted}</p>
            <p>Reviews Skipped: {gameState.reviewsSkipped}</p>
            <p>Hints Used: {gameState.hintsUsed}</p>
            <p>Max Streak: 🔥 {gameState.maxStreak}</p>
          </div>
          
          {isFreePlay && (
            <div className="mt-8 space-y-3">
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-white text-sm">
                  🌟 Amazing! You've played all available reviews in this language!
                </p>
                <p className="text-white/80 text-xs mt-2">
                  More are coming soon. Stay tuned!
                </p>
              </div>
              <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                <p className="text-white text-sm font-semibold mb-1">
                  Want to add more game reviews?
                </p>
                <p className="text-white/80 text-xs">
                  Join our moderation team! Check out the Contact page.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-steam-blue mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading review...</p>
      </div>
    );
  }

  const currentReview = reviews[currentReviewIndex];

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <ScoreDisplay
        score={gameState.score}
        streak={gameState.streak}
        reviewsCompleted={gameState.reviewsCompleted}
      />

      {/* Multi-Review Card */}
      <AnimatePresence mode="wait">
        <MultiReviewCard
          key={currentReview.id}
          reviewImages={currentReview.reviewImages}
          currentReviewIndex={currentReviewTextIndex}
          maxReviews={currentReview.maxReviews || currentReview.reviewImages.length}
          gameImage={currentReview.gameImage}
          showGenre={showGenre}
          genre={genre}
          onShowNextReview={handleShowNextReview}
          canShowNext={!isProcessing}
          mode={mode}
          totalReviews={reviews.length}
          currentGameIndex={currentReviewIndex}
          reviewResults={reviewResults}
          answerFeedback={answerFeedback}
          onSubmitAnswer={handleSubmitAnswer}
          gameNames={gameNames}
          isProcessing={isProcessing}
        />
      </AnimatePresence>

      {/* Joker Buttons */}
      <JokerButtons
        onSkip={handleSkip}
        onHint={handleHint}
        canUseHint={canUseHint(gameState.score)}
        currentScore={gameState.score}
        disabled={isProcessing}
        hintUsed={showGenre}
      />
    </div>
  );
};

export default GameBoard;


