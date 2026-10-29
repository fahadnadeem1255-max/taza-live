import React, { useState } from 'react';
import type { DailyMission, User } from '../types';

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: DailyMission[];
  onUpdateMission: (missionId: string, delta: number) => void;
  onClaimReward: (mission: DailyMission) => void;
  onClaimAllReady?: () => void;
  user?: User;
  onNavigateAction?: (actionType: string) => void;
}

const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  missions,
  onUpdateMission,
  onClaimReward,
  onClaimAllReady,
  user,
  onNavigateAction,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  if (!isOpen) return null;

  const completedCount = missions.filter(m => m.currentProgress >= m.targetProgress).length;
  const claimedCount = missions.filter(m => m.isClaimed).length;
  const readyToClaimCount = missions.filter(m => m.currentProgress >= m.targetProgress && !m.isClaimed).length;
  const totalMissions = missions.length;
  const overallPercentage = Math.round((completedCount / totalMissions) * 100);

  const filteredMissions = missions.filter(m => {
    if (filter === 'in_progress') return m.currentProgress < m.targetProgress;
    if (filter === 'completed') return m.currentProgress >= m.targetProgress;
    return true;
  });

  const totalAvailableCoins = missions
    .filter(m => !m.isClaimed)
    .reduce((sum, m) => sum + m.rewardCoins, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 border border-purple-500/70 rounded-3xl p-5 shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow backgrounds */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30 border border-pink-400/50">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  Daily Missions
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-[10px] font-bold text-pink-300">
                  Resets in 16h
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Complete tasks to earn free bonus coins</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Coins indicator */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-bold">
              <span>🪙</span>
              <span>{(user?.coins ?? 184571).toLocaleString()}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Overall Completion Milestone Card */}
        <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-pink-900/40 border border-purple-600/50 shadow-inner relative z-10 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div>
                <span className="text-xs font-bold text-white">Daily Milestone Progress</span>
                <p className="text-[10px] text-gray-300">
                  {completedCount === totalMissions
                    ? 'All daily missions achieved! Great job!'
                    : `Complete all ${totalMissions} missions to unlock the Mega Master Chest (+500 🪙)`}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/40">
              {completedCount}/{totalMissions} Done ({overallPercentage}%)
            </span>
          </div>

          {/* Master Progress Bar */}
          <div className="w-full bg-black/60 rounded-full h-3 p-0.5 border border-purple-800/80 shadow-inner">
            <div
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-md shadow-pink-500/40 relative"
              style={{ width: `${Math.max(5, overallPercentage)}%` }}
            >
              <span className="absolute inset-0 bg-white/20 rounded-full animate-pulse pointer-events-none" />
            </div>
          </div>

          {/* Milestone perks & Claim All shortcut */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-800/40 text-[11px]">
            <span className="text-gray-400">
              {totalAvailableCoins > 0 ? (
                <>Available rewards: <strong className="text-yellow-300">+{totalAvailableCoins} 🪙</strong></>
              ) : (
                <span className="text-emerald-400 font-semibold">✓ All missions claimed today!</span>
              )}
            </span>

            {readyToClaimCount > 1 && onClaimAllReady && (
              <button
                onClick={onClaimAllReady}
                className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-black font-extrabold text-[10px] rounded-lg shadow active:scale-95 transition-all"
              >
                Claim All ({readyToClaimCount}) 🎁
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 my-3 relative z-10 flex-shrink-0">
          {(
            [
              { id: 'all', label: `All (${missions.length})` },
              { id: 'in_progress', label: `In Progress (${totalMissions - completedCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.id
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-purple-900/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mission Cards List */}
        <div className="overflow-y-auto space-y-2.5 relative z-10 pr-1 flex-grow">
          {filteredMissions.length > 0 ? (
            filteredMissions.map(mission => {
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
                    {/* Icon & Mission Info */}
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
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{mission.description}</p>
                      </div>
                    </div>

                    {/* Mission Action / Claim Button */}
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
                          onClick={() => onClaimReward(mission)}
                          className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-500 hover:to-purple-700 text-white shadow-md shadow-pink-500/40 animate-pulse active:scale-95 transition-all flex items-center gap-1"
                        >
                          <span>Claim</span>
                          <span>+{mission.rewardCoins}🪙</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // Increment progress directly for fast testing & interaction
                            onUpdateMission(mission.id, 1);
                            if (onNavigateAction) {
                              onNavigateAction(mission.actionType);
                            }
                          }}
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

                  {/* Mission Progress Bar Section */}
                  <div className="mt-2.5 pt-2 border-t border-purple-900/30">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-gray-400 font-medium">Progress</span>
                      <span className="font-bold text-purple-200">
                        {mission.currentProgress} / {mission.targetProgress} {mission.unit || ''}{' '}
                        <span className="text-pink-400 font-normal">({progressPercentage}%)</span>
                      </span>
                    </div>

                    <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-purple-900/70">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                            : 'bg-gradient-to-r from-pink-500 to-purple-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-400">
              <span className="text-3xl block mb-2">✨</span>
              <p className="font-semibold text-sm">No missions in this category.</p>
            </div>
          )}
        </div>

        {/* Modal Footer with Simulation / Quick Testing Helper */}
        <div className="pt-3 border-t border-purple-800/40 flex items-center justify-between text-[11px] text-gray-400 relative z-10 flex-shrink-0">
          <span className="text-[10px] text-gray-500">Quick Test Actions:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                missions.forEach(m => {
                  if (m.currentProgress < m.targetProgress) {
                    onUpdateMission(m.id, m.targetProgress - m.currentProgress);
                  }
                });
              }}
              className="text-[10px] text-pink-400 hover:text-pink-300 underline font-medium transition-colors"
            >
              ⚡ Complete All
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => {
                missions.forEach(m => {
                  onUpdateMission(m.id, -m.currentProgress);
                });
              }}
              className="text-[10px] text-gray-400 hover:text-gray-300 underline transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyMissionsModal;
