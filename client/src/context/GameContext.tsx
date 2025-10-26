import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState } from '../utils/gameLogic';

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  resetGame: () => void;
  updateScore: (newScore: number) => void;
  updateStreak: (newStreak: number) => void;
  incrementCompleted: () => void;
  incrementSkipped: () => void;
  incrementHintsUsed: () => void;
}

const initialGameState: GameState = {
  score: 0,
  streak: 0,
  reviewsCompleted: 0,
  reviewsSkipped: 0,
  hintsUsed: 0,
  maxStreak: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const updateScore = (newScore: number) => {
    setGameState(prev => ({ ...prev, score: newScore }));
  };

  const updateStreak = (newStreak: number) => {
    setGameState(prev => ({
      ...prev,
      streak: newStreak,
      maxStreak: Math.max(prev.maxStreak, newStreak)
    }));
  };

  const incrementCompleted = () => {
    setGameState(prev => ({ ...prev, reviewsCompleted: prev.reviewsCompleted + 1 }));
  };

  const incrementSkipped = () => {
    setGameState(prev => ({ ...prev, reviewsSkipped: prev.reviewsSkipped + 1 }));
  };

  const incrementHintsUsed = () => {
    setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const value: GameContextType = {
    gameState,
    setGameState,
    resetGame,
    updateScore,
    updateStreak,
    incrementCompleted,
    incrementSkipped,
    incrementHintsUsed
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};


