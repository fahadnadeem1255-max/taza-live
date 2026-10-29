import React, { useState, useEffect } from 'react';
import type { User, DailyMission } from '../types';
import { mockDailyMissions } from '../constants';

interface RewardScreenProps {
  onBack: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  showToast?: (message: string) => void;
}

const RewardScreen: React.FC<RewardScreenProps> = ({ onBack, user, setUser, showToast }) => {
  const [missions, setMissions] = useState<DailyMission[]>(() => {
    try {
      const saved = localStorage.getItem('social_live_daily_missions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return mockDailyMissions;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('social_live_daily_missions', JSON.stringify(missions));
    } catch (e) {}
  }, [missions]);

  const handleUpdateMissionProgress = (missionId: string, delta: number) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id !== missionId) return m;
        const newProgress = Math.max(0, Math.min(m.targetProgress, m.currentProgress + delta));
        return { ...m, currentProgress: newProgress };
      })
    );
    showToast?.('Mission progress updated!');
  };

  const handleClaimReward = (mission: DailyMission) => {
    if (mission.isClaimed) return;
    if (mission.currentProgress < mission.targetProgress) {
      showToast?.('Complete the mission first to claim rewards!');
      return;
    }

    setMissions(prev =>
      prev.map(m => (m.id === mission.id ? { ...m, isClaimed: true } : m))
    );

    setUser(prev => ({
      ...prev,
      coins: prev.coins + mission.rewardCoins,
    }));

    showToast?.(`🎉 Claimed +${mission.rewardCoins} Coins for "${mission.title}"!`);
  };

  const handleClaimAllReady = () => {
    const readyMissions = missions.filter(m => m.currentProgress >= m.targetProgress && !m.isClaimed);
    if (readyMissions.length === 0) return;

    const totalCoins = readyMissions.reduce((sum, m) => sum + m.rewardCoins, 0);

    setMissions(prev =>
      prev.map(m =>
        m.currentProgress >= m.targetProgress ? { ...m, isClaimed: true } : m
      )
    );

    setUser(prev => ({
      ...prev,
      coins: prev.coins + totalCoins,
    }));

    showToast?.(`🎉 Claimed all ready missions! +${totalCoins} Coins added to your wallet!`);
  };

  const completedCount = missions.filter(m => m.currentProgress >= m.targetProgress).length;
  const readyToClaimCount = missions.filter(m => m.currentProgress >= m.targetProgress && !m.isClaimed).length;
  const totalMissions = missions.length;
  const overallPercentage = Math.round((completedCount / totalMissions) * 100);

  const filteredMissions = missions.filter(m => {
    if (activeTab === 'in_progress') return m.currentProgress < m.targetProgress;
    if (activeTab === 'completed') return m.currentProgress >= m.targetProgress;
    return true;
  });

  return (
    <div className="p-4 h-screen flex flex-col text-white max-w-lg mx-auto overflow-hidden">
      {/* Header */}
      <header className="relative flex items-center justify-between mb-4 pb-2 border-b border-purple-800/50 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
            Daily Missions
          </h1>
          <p className="text-[10px] text-gray-400">Complete tasks & earn coins daily</p>
        </div>

        {/* Coin balance chip */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-bold">
          <span>🪙</span>
          <span>{user.coins.toLocaleString()}</span>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-grow overflow-y-auto space-y-4 pr-1">
        {/* Master Milestone Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-pink-900/40 border border-purple-600/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-flame">🏆</span>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Daily Progress Milestone
                </h3>
                <p className="text-[11px] text-gray-300">
                  {completedCount === totalMissions
                    ? 'All missions completed for today!'
                    : 'Complete all missions to unlock the Master Bonus (+500 🪙)'}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-pink-300 bg-pink-500/20 px-2.5 py-1 rounded-full border border-pink-500/40">
              {completedCount}/{totalMissions} ({overallPercentage}%)
            </span>
          </div>

          {/* Master Progress Bar */}
          <div className="w-full bg-black/60 rounded-full h-3.5 p-0.5 border border-purple-800/80 shadow-inner">
            <div
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-md shadow-pink-500/40"
              style={{ width: `${Math.max(6, overallPercentage)}%` }}
            />
          </div>

          {/* Bottom actions in milestone card */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-purple-800/40 text-xs">
            <span className="text-gray-400 text-[11px]">
              Resets every night at 00:00 UTC
            </span>
            {readyToClaimCount > 0 && (
              <button
                onClick={handleClaimAllReady}
                className="px-3 py-1 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-black font-extrabold text-xs rounded-xl shadow active:scale-95 transition-all"
              >
                Claim All ({readyToClaimCount}) 🎁
              </button>
            )}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(
            [
              { id: 'all', label: `All (${missions.length})` },
              { id: 'in_progress', label: `In Progress (${totalMissions - completedCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-purple-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="space-y-3">
          {filteredMissions.map(mission => {
            const isCompleted = mission.currentProgress >= mission.targetProgress;
            const isClaimed = mission.isClaimed;
            const isReadyToClaim = isCompleted && !isClaimed;
            const progressPercentage = Math.min(
              100,
              Math.round((mission.currentProgress / mission.targetProgress) * 100)
            );

            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-2xl transition-all border ${
                  isClaimed
                    ? 'bg-purple-950/20 border-purple-900/40 opacity-70'
                    : isReadyToClaim
                    ? 'bg-gradient-to-r from-pink-950/40 via-purple-950/50 to-indigo-950/40 border-pink-500/80 shadow-lg shadow-pink-500/20 scale-[1.01]'
                    : 'bg-black/50 border-purple-800/60 hover:border-purple-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-grow">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-md ${
                        isClaimed
                          ? 'bg-gray-800 text-gray-500'
                          : isReadyToClaim
                          ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white animate-bounce'
                          : 'bg-purple-900/50 border border-purple-700/60'
                      }`}
                    >
                      {mission.icon}
                    </div>

                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white truncate">{mission.title}</h4>
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[10px] font-extrabold flex-shrink-0">
                          +{mission.rewardCoins} 🪙
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{mission.description}</p>
                    </div>
                  </div>

                  {/* Action/Claim Button */}
                  <div className="flex-shrink-0">
                    {isClaimed ? (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Claimed</span>
                      </div>
                    ) : isReadyToClaim ? (
                      <button
                        onClick={() => handleClaimReward(mission)}
                        className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-500 hover:to-purple-700 text-white shadow-md shadow-pink-500/40 animate-pulse active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span>Claim</span>
                        <span>+{mission.rewardCoins}🪙</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateMissionProgress(mission.id, 1)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/60 text-purple-200 hover:text-white transition-all active:scale-95 flex items-center gap-1"
                        title="Complete step"
                      >
                        <span>Do It (+1)</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="mt-3 pt-2.5 border-t border-purple-900/30">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-gray-400 font-medium">Mission Progress</span>
                    <span className="font-bold text-purple-200">
                      {mission.currentProgress} / {mission.targetProgress} {mission.unit || ''}{' '}
                      <span className="text-pink-400 font-normal">({progressPercentage}%)</span>
                    </span>
                  </div>

                  <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-purple-900/70 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                          : 'bg-gradient-to-r from-pink-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.max(progressPercentage > 0 ? 5 : 0, progressPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Demo Controls */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between text-xs text-gray-400">
          <span className="text-[11px] text-gray-400">Testing Tools:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMissions(prev =>
                  prev.map(m => ({ ...m, currentProgress: m.targetProgress }))
                );
                showToast?.('All missions marked ready to claim!');
              }}
              className="text-[11px] text-pink-400 hover:text-pink-300 underline font-medium"
            >
              ⚡ Complete All
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => {
                setMissions(mockDailyMissions);
                showToast?.('Missions reset to default!');
              }}
              className="text-[11px] text-gray-400 hover:text-gray-300 underline"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardScreen;