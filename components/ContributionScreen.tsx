import React, { useState } from 'react';
import type { User, GiftingStat } from '../types';

interface ContributionScreenProps {
  user: User;
  onBack: () => void;
}

type ContributionPeriod = 'daily' | 'weekly' | 'monthly' | 'overall';

const ContributionScreen: React.FC<ContributionScreenProps> = ({ user, onBack }) => {
  const [activePeriod, setActivePeriod] = useState<ContributionPeriod>('daily');

  const contributions = user.contributions || { daily: [], weekly: [], monthly: [], overall: [] };
  const activeLeaderboard = contributions[activePeriod];
  
  const totalGifting = contributions.overall.reduce((sum, entry) => sum + entry.amount, 0);

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
  };

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-4 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Contribution</h1>
      </header>

      {/* User Summary */}
      <div className="flex items-center p-4 rounded-lg bg-black/50 border border-purple-800 mb-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-2 border-purple-500" />
        <div className="ml-4">
            <p className="font-bold text-lg">{user.name}</p>
            <p className="text-sm text-gray-400">ID: {user.idNumber}</p>
            <p className="text-sm text-yellow-400 mt-1">Total Gifting: {totalGifting.toLocaleString()} 💎</p>
        </div>
      </div>
      
      {/* Time Period Tabs */}
      <div className="flex justify-around items-center mb-4 p-1 bg-black/50 border border-purple-800 rounded-full">
        {(['daily', 'weekly', 'monthly', 'overall'] as ContributionPeriod[]).map(period => (
          <button 
            key={period} 
            onClick={() => setActivePeriod(period)}
            className={`w-full py-2 text-xs font-semibold rounded-full capitalize transition-colors ${
              activePeriod === period ? 'bg-pink-600 text-white' : 'text-gray-400'
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
            <p>No contribution data for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionScreen;