import React, { useState } from 'react';
import type { Rankings, RankingEntry } from '../types';

interface RankingScreenProps {
  rankings: Rankings;
  onBack: () => void;
}

type RankingCategory = 'gifters' | 'receivers';
type RankingPeriod = 'daily' | 'weekly' | 'monthly';

const RankingScreen: React.FC<RankingScreenProps> = ({ rankings, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<RankingCategory>('gifters');
  const [activePeriod, setActivePeriod] = useState<RankingPeriod>('daily');

  const activeLeaderboard = rankings[activeCategory][activePeriod];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  }

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Ranking</h1>
      </header>

      {/* Main Category Tabs */}
      <div className="flex justify-center items-center mb-4 p-1 bg-black/50 border border-purple-800 rounded-full">
        <button 
          onClick={() => setActiveCategory('gifters')}
          className={`w-full py-2 text-sm font-semibold rounded-full capitalize transition-colors ${activeCategory === 'gifters' ? 'bg-pink-600 text-white' : 'text-gray-400'}`}
        >
          Top Gifter
        </button>
        <button 
          onClick={() => setActiveCategory('receivers')}
          className={`w-full py-2 text-sm font-semibold rounded-full capitalize transition-colors ${activeCategory === 'receivers' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
        >
          Top Receiver
        </button>
      </div>

      {/* Time Period Sub-Tabs */}
      <div className="flex justify-around items-center mb-4">
        {(['daily', 'weekly', 'monthly'] as RankingPeriod[]).map(period => (
          <button 
            key={period} 
            onClick={() => setActivePeriod(period)}
            className={`px-4 py-1 text-sm font-semibold capitalize transition-colors ${
              activePeriod === period ? 'text-white border-b-2 border-cyan-400' : 'text-gray-500'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="flex-grow overflow-y-auto space-y-2">
        {activeLeaderboard.length > 0 ? (
          activeLeaderboard.map((entry) => (
            <div key={entry.rank} className="flex items-center p-3 rounded-lg bg-black/50 border border-purple-900">
              <span className={`font-bold text-xl w-10 text-center ${getRankColor(entry.rank)}`}>
                {getRankIcon(entry.rank)}
              </span>
              <img src={entry.user.avatar} alt={entry.user.name} className="w-12 h-12 rounded-full mx-3 border-2 border-purple-600" />
              <p className="flex-grow font-semibold">{entry.user.name}</p>
              <div className="flex items-center text-yellow-400">
                <span className="text-xl mr-1">💎</span>
                <span className="font-bold">{entry.amount.toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 pt-16">
            <p>No ranking data for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingScreen;