import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Header from './components/Header';
import Home from './pages/Home';
import DailyChallenge from './pages/DailyChallenge';
import FreePlay from './pages/FreePlay';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-steam-dark to-slate-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/daily" element={<DailyChallenge />} />
              <Route path="/freeplay" element={<FreePlay />} />
              <Route path="/profile/:userId?" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #475569'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f1f5f9'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f1f5f9'
                }
              }
            }}
          />
        </div>
      </GameProvider>
    </AuthProvider>
  );
};

export default App;


