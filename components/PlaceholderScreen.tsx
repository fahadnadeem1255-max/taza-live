import React from 'react';

interface PlaceholderScreenProps {
  title: string;
  onBack: () => void;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title, onBack }) => {
  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">{title}</h1>
      </header>
      <div className="flex-grow flex items-center justify-center bg-black/50 border border-purple-900 rounded-lg">
        <div className="text-center">
            <h2 className="text-xl text-gray-400">Coming Soon!</h2>
            <p className="text-gray-500 mt-2">The "{title}" feature is currently under development.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderScreen;