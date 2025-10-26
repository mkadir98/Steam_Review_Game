export interface GameState {
  score: number;
  streak: number;
  reviewsCompleted: number;
  reviewsSkipped: number;
  hintsUsed: number;
  maxStreak: number;
}

export const POINTS = {
  CORRECT_ANSWER: 100,
  SKIP_PENALTY: 30,
  HINT_COST: 20,
  STREAK_BONUS: 10,
  NEXT_REVIEW_PENALTY: 25  // Penalty for showing next review of same game
};

export const calculateScore = (
  isCorrect: boolean,
  currentScore: number,
  currentStreak: number,
  usedSkip: boolean = false
): { newScore: number; newStreak: number; pointsEarned: number } => {
  let pointsEarned = 0;
  let newStreak = currentStreak;

  if (isCorrect) {
    // Base points for correct answer
    pointsEarned = POINTS.CORRECT_ANSWER;
    
    // Add streak bonus
    pointsEarned += currentStreak * POINTS.STREAK_BONUS;
    
    // Increase streak
    newStreak = currentStreak + 1;
  } else {
    // Reset streak on wrong answer
    newStreak = 0;
  }

  // Apply skip penalty if used
  if (usedSkip) {
    pointsEarned -= POINTS.SKIP_PENALTY;
  }

  const newScore = Math.max(0, currentScore + pointsEarned);

  return { newScore, newStreak, pointsEarned };
};

export const canUseHint = (currentScore: number): boolean => {
  return currentScore >= POINTS.HINT_COST;
};

export const useHint = (currentScore: number): number => {
  return Math.max(0, currentScore - POINTS.HINT_COST);
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '';
  if (streak < 3) return '🔥';
  if (streak < 5) return '🔥🔥';
  if (streak < 10) return '🔥🔥🔥';
  return '🔥🔥🔥⚡';
};


