import React, { useState } from 'react';

interface LanguageScreenProps {
  onBack: () => void;
  showToast: (message: string) => void;
}

const languages = [
  'English',
  'Español',
  'Français',
  'Deutsch',
  'Português',
  'العربية',
  'हिन्दी',
  '中文 (简体)',
];

const LanguageScreen: React.FC<LanguageScreenProps> = ({ onBack, showToast }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSave = () => {
    showToast(`Language saved: ${selectedLanguage}`);
    onBack();
  };

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Language</h1>
      </header>
      <div className="flex-grow flex flex-col justify-between overflow-y-auto">
        <div className="space-y-2">
          {languages.map(lang => (
            <button 
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`w-full text-left p-4 rounded-lg flex justify-between items-center transition-colors ${selectedLanguage === lang ? 'bg-purple-600/50 border border-purple-500' : 'bg-black/50 border border-purple-800 hover:bg-purple-900/30'}`}
            >
              <span>{lang}</span>
              {selectedLanguage === lang && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="py-4">
             <button 
                onClick={handleSave}
                className="w-full p-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold"
             >
                Save Changes
             </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageScreen;