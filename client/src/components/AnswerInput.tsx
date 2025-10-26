import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  gameNames?: string[];
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, disabled, gameNames = [] }) => {
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (answer.length > 1 && gameNames.length > 0) {
      const filtered = gameNames
        .filter(name => name.toLowerCase().includes(answer.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [answer, gameNames]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAnswer(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setAnswer(suggestions[selectedIndex]);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => answer.length > 1 && setSuggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Type the game name..."
          disabled={disabled}
          className="w-full bg-slate-900 border-2 border-slate-600 focus:border-steam-blue rounded-xl px-6 py-4 text-white text-lg placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-steam-blue hover:bg-steam-light-blue text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>

      {/* Autocomplete Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-6 py-3 hover:bg-slate-700 transition-colors ${
                  index === selectedIndex ? 'bg-slate-700' : ''
                }`}
              >
                <span className="text-white">{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default AnswerInput;


