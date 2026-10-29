import React from 'react';

export interface CheckInDay {
  day: number;
  coins: number;
  icon: string;
  label: string;
  isMega?: boolean;
}

export const CHECK_IN_DAYS: CheckInDay[] = [
  { day: 1, coins: 50, icon: '🪙', label: 'Day 1' },
  { day: 2, coins: 100, icon: '🪙', label: 'Day 2' },
  { day: 3, coins: 150, icon: '💎', label: 'Day 3' },
  { day: 4, coins: 200, icon: '🔥', label: 'Day 4' },
  { day: 5, coins: 300, icon: '⭐', label: 'Day 5' },
  { day: 6, coins: 400, icon: '🚀', label: 'Day 6' },
  { day: 7, coins: 600, icon: '👑', label: 'Day 7', isMega: true },
];

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  hasCheckedInToday: boolean;
  currentCycleDay: number;
  claimedDays: number[];
  onClaim: () => void;
  onSimulateNextDay?: () => void;
}

const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  streak,
  hasCheckedInToday,
  currentCycleDay,
  claimedDays,
  onClaim,
  onSimulateNextDay,
}) => {
  if (!isOpen) return null;

  const todayReward = CHECK_IN_DAYS.find(d => d.day === currentCycleDay) || CHECK_IN_DAYS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 border border-purple-600/70 rounded-3xl p-5 sm:p-6 shadow-2xl text-white overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background decorative glows */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-flame">🔥</span>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                Daily Check-in
              </h2>
              <p className="text-[11px] text-gray-400">Earn coins for consecutive logins</p>
            </div>
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

        {/* Content body */}
        <div className="overflow-y-auto py-4 space-y-4 relative z-10 pr-0.5">
          {/* Streak Status Showcase Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-600/20 border border-orange-500/40 p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/30 border border-orange-400/50 text-[11px] font-bold text-orange-200">
                <span className="animate-flame">🔥</span>
                <span>Active Login Streak</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {streak}
                </span>
                <span className="text-sm font-semibold text-orange-300">
                  {streak === 1 ? 'Day' : 'Days'} in a row
                </span>
              </div>
              <p className="text-xs text-gray-300">
                {hasCheckedInToday
                  ? `Checked in today! Return tomorrow for Day ${currentCycleDay === 7 ? 1 : currentCycleDay + 1} reward.`
                  : `Check in now to claim today's +${todayReward.coins} coins!`}
              </p>
            </div>

            {/* Streak flame badge visual */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-600 flex flex-col items-center justify-center shadow-lg shadow-orange-500/30 border border-amber-300/40 flex-shrink-0 animate-flame">
              <span className="text-2xl">🔥</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-yellow-100">
                {streak}D
              </span>
            </div>
          </div>

          {/* 7-Day Rewards Calendar Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                7-Day Reward Cycle
              </h3>
              <span className="text-[11px] text-gray-400">
                Day {currentCycleDay} of 7
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2">
              {CHECK_IN_DAYS.slice(0, 4).map((dayItem) => {
                const isClaimed = claimedDays.includes(dayItem.day);
                const isToday = dayItem.day === currentCycleDay;
                const isPendingToday = isToday && !hasCheckedInToday;

                return (
                  <div
                    key={dayItem.day}
                    className={`relative rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition-all ${
                      isClaimed
                        ? 'bg-purple-950/40 border border-emerald-500/40 opacity-75'
                        : isPendingToday
                        ? 'bg-gradient-to-b from-pink-500/25 to-purple-600/30 border-2 border-pink-400 shadow-lg shadow-pink-500/25 scale-102'
                        : isToday && hasCheckedInToday
                        ? 'bg-emerald-950/40 border border-emerald-400'
                        : 'bg-black/40 border border-purple-900/60'
                    }`}
                  >
                    <span className="text-[10px] font-semibold text-gray-400 mb-1">
                      {dayItem.label}
                    </span>
                    <span className={`text-xl mb-1 ${isPendingToday ? 'animate-bounce' : ''}`}>
                      {dayItem.icon}
                    </span>
                    <span className="text-xs font-extrabold text-yellow-300">
                      +{dayItem.coins}
                    </span>
                    <span className="text-[9px] text-gray-400">coins</span>

                    {/* Status badge */}
                    {isClaimed ? (
                      <div className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-emerald-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Done</span>
                      </div>
                    ) : isPendingToday ? (
                      <span className="mt-1 px-1.5 py-0.5 bg-pink-500 text-white rounded text-[8px] font-extrabold uppercase animate-pulse">
                        Today
                      </span>
                    ) : (
                      <span className="mt-1 text-[9px] text-gray-500 flex items-center gap-0.5">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CHECK_IN_DAYS.slice(4).map((dayItem) => {
                const isClaimed = claimedDays.includes(dayItem.day);
                const isToday = dayItem.day === currentCycleDay;
                const isPendingToday = isToday && !hasCheckedInToday;
                const isMega = dayItem.isMega;

                return (
                  <div
                    key={dayItem.day}
                    className={`relative rounded-xl p-2.5 flex flex-col items-center justify-center text-center transition-all ${
                      isMega
                        ? isClaimed
                          ? 'bg-amber-950/40 border border-emerald-500/40 opacity-75'
                          : isPendingToday
                          ? 'bg-gradient-to-b from-amber-500/30 to-pink-600/40 border-2 border-yellow-400 shadow-lg shadow-yellow-500/30 scale-102'
                          : 'bg-gradient-to-b from-amber-900/30 to-purple-900/30 border border-amber-500/50'
                        : isClaimed
                        ? 'bg-purple-950/40 border border-emerald-500/40 opacity-75'
                        : isPendingToday
                        ? 'bg-gradient-to-b from-pink-500/25 to-purple-600/30 border-2 border-pink-400 shadow-lg shadow-pink-500/25 scale-102'
                        : 'bg-black/40 border border-purple-900/60'
                    }`}
                  >
                    {isMega && (
                      <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black text-[8px] rounded-full uppercase">
                        Mega
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-gray-400 mb-1">
                      {dayItem.label}
                    </span>
                    <span className={`text-xl mb-1 ${isPendingToday ? 'animate-bounce' : ''}`}>
                      {dayItem.icon}
                    </span>
                    <span className="text-xs font-extrabold text-yellow-300">
                      +{dayItem.coins}
                    </span>
                    <span className="text-[9px] text-gray-400">coins</span>

                    {/* Status badge */}
                    {isClaimed ? (
                      <div className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-emerald-400">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Done</span>
                      </div>
                    ) : isPendingToday ? (
                      <span className="mt-1 px-1.5 py-0.5 bg-pink-500 text-white rounded text-[8px] font-extrabold uppercase animate-pulse">
                        Today
                      </span>
                    ) : (
                      <span className="mt-1 text-[9px] text-gray-500 flex items-center gap-0.5">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules & streak incentive */}
          <div className="bg-purple-950/40 rounded-xl p-3 border border-purple-800/40 text-[11px] text-gray-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-purple-200">
              <span>💡</span>
              <span>Streak Rules</span>
            </div>
            <p className="text-gray-400">
              Log in every day without breaking your streak. Complete all 7 days to unlock the Mega +600 Coins chest!
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-purple-800/40 space-y-2 relative z-10 flex-shrink-0">
          {!hasCheckedInToday ? (
            <button
              onClick={() => {
                onClaim();
              }}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>🎉</span>
              <span>Claim Day {currentCycleDay} Reward (+{todayReward.coins} Coins)</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Checked In Today (+{todayReward.coins} Claimed)</span>
            </button>
          )}

          {/* Test/Demo Simulation Button */}
          {onSimulateNextDay && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-gray-500">Demo Testing Tool:</span>
              <button
                onClick={onSimulateNextDay}
                className="text-[10px] text-pink-400 hover:text-pink-300 underline font-medium transition-colors"
                title="Advance to next calendar day to test consecutive check-ins"
              >
                ⏩ Simulate Next Day ({hasCheckedInToday ? 'Unlock next day' : 'Advance streak'})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckInModal;
