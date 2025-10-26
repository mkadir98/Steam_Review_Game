import React from 'react';
import { motion } from 'framer-motion';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // Only EN and TR are available for now
  const availableLanguages = ['en', 'tr'];

  const selectedLang = languages.find(l => l.code === selectedLanguage) || languages[0];

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center space-x-2">
        <span>🌍</span>
        <span>Review Language</span>
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {languages.map(lang => {
          const isAvailable = availableLanguages.includes(lang.code);
          return (
            <motion.button
              key={lang.code}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              onClick={() => isAvailable && onLanguageChange(lang.code)}
              disabled={!isAvailable}
              className={`p-3 rounded-lg border-2 transition-all relative ${
                selectedLanguage === lang.code
                  ? 'bg-steam-blue border-steam-light-blue'
                  : isAvailable
                    ? 'bg-slate-900 border-slate-600 hover:border-slate-500'
                    : 'bg-slate-900/50 border-slate-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className={`text-xs font-semibold ${
                selectedLanguage === lang.code
                  ? 'text-white'
                  : 'text-gray-400'
              }`}>
                {lang.code.toUpperCase()}
              </div>
              {!isAvailable && (
                <div className="absolute top-1 right-1 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded font-bold">
                  SOON
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">
        {selectedLang.flag} Playing in <span className="font-semibold text-white">{selectedLang.name}</span>
      </p>
    </div>
  );
};

export default LanguageSelector;

