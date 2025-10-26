import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  onReset?: () => void;
  className?: string;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onReset, className = '' }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date();
    
    // Calculate next UTC midnight
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(24, 0, 0, 0);
    
    const diff = nextMidnight.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  };

  useEffect(() => {
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining();
      setTimeRemaining(newTime);

      // Check if countdown reached zero
      if (newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        if (onReset) {
          onReset();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onReset]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="bg-slate-700/50 px-4 py-3 rounded-lg font-mono text-2xl font-bold backdrop-blur-sm">
          {formatNumber(timeRemaining.hours)}
        </div>
        <span className="text-white text-xl font-bold">:</span>
        <div className="bg-slate-700/50 px-4 py-3 rounded-lg font-mono text-2xl font-bold backdrop-blur-sm">
          {formatNumber(timeRemaining.minutes)}
        </div>
        <span className="text-white text-xl font-bold">:</span>
        <div className="bg-slate-700/50 px-4 py-3 rounded-lg font-mono text-2xl font-bold backdrop-blur-sm">
          {formatNumber(timeRemaining.seconds)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

