import React, { useState } from 'react';
import type { User, Reward } from '../types';
import { mockRewards } from '../constants';

interface RewardScreenProps {
  onBack: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const RewardScreen: React.FC<RewardScreenProps> = ({ onBack, user, setUser }) => {
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());

  const handleClaim = (reward: Reward) => {
    if (claimedRewards.has(reward.id)) return;

    if (reward.action === 'claim') {
      setUser(prevUser => ({ ...prevUser, coins: prevUser.coins + reward.coins }));
      setClaimedRewards(prev => new Set(prev).add(reward.id));
      alert(`You've claimed ${reward.coins} coins!`);
    } else {
      // For "go" actions, you would navigate the user to the relevant screen.
      // This is a placeholder for that logic.
      alert(`Navigate to the task: ${reward.title}`);
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Reward Center</h1>
      </header>
      <div className="flex-grow overflow-y-auto space-y-3">
        {mockRewards.map(reward => {
          const isClaimed = claimedRewards.has(reward.id);
          return (
            <div key={reward.id} className="p-4 rounded-lg bg-black/50 border border-purple-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">{reward.title}</h3>
                <p className="text-sm text-gray-400">{reward.description}</p>
                <p className="text-yellow-400 font-bold mt-1">+ {reward.coins} Coins</p>
              </div>
              <button
                onClick={() => handleClaim(reward)}
                disabled={isClaimed}
                className={`px-4 py-2 rounded-full font-bold text-sm ${
                  isClaimed
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : reward.action === 'claim'
                    ? 'bg-green-500 text-white'
                    : 'bg-pink-600 text-white'
                }`}
              >
                {isClaimed ? 'Claimed' : reward.action === 'claim' ? 'Claim' : 'Go'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardScreen;