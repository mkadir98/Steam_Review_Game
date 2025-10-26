import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface GlobalStats {
  totalUsers: number;
  onlineUsers: number;
  totalGamesPlayed: number;
  totalCorrectAnswers: number;
}

interface HardestReview {
  _id: string;
  gameName: string;
  gameImage?: string;
  difficulty: string;
  totalPlays: number;
  successRate: number;
}

interface ReviewStats {
  _id: string;
  gameName: string;
  gameImage?: string;
  difficulty: string;
  totalPlays: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skips: number;
  hints: number;
  successRate: number;
  skipPercentage: number;
  hintPercentage: number;
}

interface AnalyticsData {
  globalStats: GlobalStats;
  hardestReview: HardestReview | null;
  reviewStats: ReviewStats[];
  timestamp: string;
}

export const useAnalytics = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No authentication token');
      return;
    }

    // Get the API URL and convert it to WebSocket URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');

    // Initialize socket connection
    const newSocket = io(baseUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    newSocket.on('stats-update', (data: AnalyticsData) => {
      setAnalyticsData(data);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [token]);

  return {
    analyticsData,
    isConnected,
    error,
    socket
  };
};

