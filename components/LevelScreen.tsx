import React from 'react';
import type { User } from '../types';

interface LevelScreenProps {
  onBack: () => void;
  user: User;
}

const LevelScreen: React.FC<LevelScreenProps> = ({ onBack, user }) => {
  const currentLevel = user.level || 1;
  const currentXp = user.xp?.current || 50;
  const nextLevelXp = user.xp?.next || 200;
  const progress = (currentXp / nextLevelXp) * 100;

  const levelPerks = [
      { level: 1, perk: 'Basic chat badge.' },
      { level: 5, perk: 'Unlock special room entry effect.' },
      { level: 10, perk: 'Unlock exclusive profile frame.' },
      { level: 20, perk: 'Increased daily coin rewards.' },
  ];

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">My Level</h1>
      </header>
      <div className="flex-grow overflow-y-auto">
        <div className="bg-black/50 border border-purple-800 p-6 rounded-lg text-center">
          <p className="text-gray-400 text-sm">CURRENT LEVEL</p>
          <p className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text my-2">{currentLevel}</p>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</p>
        </div>
        
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">Level Rewards</h2>
            <div className="space-y-3">
            {levelPerks.map(item => (
                <div key={item.level} className={`p-4 rounded-lg border flex justify-between items-center ${currentLevel >= item.level ? 'bg-purple-900/50 border-purple-700' : 'bg-black/50 border-purple-800'}`}>
                    <span className="font-bold">Level {item.level}</span>
                    <span className={currentLevel >= item.level ? 'text-purple-300' : 'text-gray-500'}>{item.perk}</span>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LevelScreen;