import React, { useState, useEffect, useRef } from 'react';
import type { User, LuckyWheelReward } from '../types';

export const LUCKY_REWARDS: LuckyWheelReward[] = [
  {
    id: 'p1',
    name: '1,000 Coins',
    type: 'coins',
    value: 1000,
    icon: '🪙',
    description: 'Huge Jackpot! Instant 1,000 Coins credited to your wallet.',
    color: '#EAB308', // Gold
    textColor: '#FFFFFF',
    probabilityWeight: 6,
    rarity: 'Legendary',
    rarityBadge: 'LEGENDARY',
  },
  {
    id: 'p2',
    name: 'Cyber Neon Frame',
    type: 'frame',
    value: 'https://i.ibb.co/wJCMp1M/frame-blue-ice.png',
    icon: '⚡',
    description: 'Electric neon glowing profile avatar frame.',
    color: '#06B6D4', // Cyan
    textColor: '#FFFFFF',
    probabilityWeight: 12,
    rarity: 'Epic',
    rarityBadge: 'EPIC',
  },
  {
    id: 'p3',
    name: 'Lucky Star Badge',
    type: 'badge',
    value: '⭐ Lucky Star',
    icon: '⭐',
    description: 'Exclusive shining Lucky Star profile distinction.',
    color: '#8B5CF6', // Purple
    textColor: '#FFFFFF',
    probabilityWeight: 14,
    rarity: 'Rare',
    rarityBadge: 'RARE',
  },
  {
    id: 'p4',
    name: '150 Coins',
    type: 'coins',
    value: 150,
    icon: '💰',
    description: '3x Return on your spin investment!',
    color: '#10B981', // Emerald
    textColor: '#FFFFFF',
    probabilityWeight: 22,
    rarity: 'Common',
    rarityBadge: 'COMMON',
  },
  {
    id: 'p5',
    name: 'Phoenix Fire Frame',
    type: 'frame',
    value: 'https://i.ibb.co/N21yg1p/frame-red-gold.png',
    icon: '🔥',
    description: 'Mythic flaming phoenix crown profile frame.',
    color: '#EF4444', // Red
    textColor: '#FFFFFF',
    probabilityWeight: 8,
    rarity: 'Legendary',
    rarityBadge: 'LEGENDARY',
  },
  {
    id: 'p6',
    name: 'Diamond Spinner',
    type: 'badge',
    value: '💎 Diamond Spinner',
    icon: '💎',
    description: 'Prestigious diamond status for frequent spinners.',
    color: '#EC4899', // Pink
    textColor: '#FFFFFF',
    probabilityWeight: 14,
    rarity: 'Epic',
    rarityBadge: 'EPIC',
  },
  {
    id: 'p7',
    name: '50 Coins (Free Spin)',
    type: 'coins',
    value: 50,
    icon: '🪙',
    description: 'Break-even! Reclaim your 50 coins to spin again.',
    color: '#3B82F6', // Blue
    textColor: '#FFFFFF',
    probabilityWeight: 28,
    rarity: 'Common',
    rarityBadge: 'COMMON',
  },
  {
    id: 'p8',
    name: 'Astronaut Frame',
    type: 'frame',
    value: 'https://i.ibb.co/3sXkCwq/frame-astronaut.png',
    icon: '🚀',
    description: 'Cosmic space explorer animated profile frame.',
    color: '#6366F1', // Indigo
    textColor: '#FFFFFF',
    probabilityWeight: 10,
    rarity: 'Rare',
    rarityBadge: 'RARE',
  },
];

const SPIN_COST = 50;

// Web Audio API sound synthesizers for realistic mechanical click & win chime
const playTickSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Audio might be blocked without user gesture
  }
};

const playWinSound = (rarity: string) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = rarity === 'Legendary' ? [523.25, 659.25, 783.99, 1046.5] : [440, 554.37, 659.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
    });
  } catch {}
};

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  showToast?: (message: string) => void;
}

const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  user,
  setUser,
  showToast,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningReward, setWinningReward] = useState<LuckyWheelReward | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'wheel' | 'inventory'>('wheel');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinCount, setSpinCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem('social_live_lucky_spins_count') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [liveDrops, setLiveDrops] = useState([
    { id: 1, user: 'Bella', prize: '1,000 Coins', icon: '🪙', rarity: 'Legendary' },
    { id: 2, user: 'Charlie', prize: 'Diamond Spinner', icon: '💎', rarity: 'Epic' },
    { id: 3, user: 'Elias', prize: 'Phoenix Fire Frame', icon: '🔥', rarity: 'Legendary' },
    { id: 4, user: 'Dana', prize: '150 Coins', icon: '💰', rarity: 'Common' },
    { id: 5, user: 'Ivan', prize: 'Cyber Neon Frame', icon: '⚡', rarity: 'Epic' },
  ]);

  const tickIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowPrizeModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const segmentAngle = 360 / LUCKY_REWARDS.length; // 45 degrees

  const handleSpin = () => {
    if (isSpinning) return;

    if (user.coins < SPIN_COST) {
      showToast?.(`Not enough coins! You need 50 coins to spin. Current: ${user.coins.toLocaleString()} 🪙`);
      return;
    }

    // Deduct spin cost immediately
    setUser(prev => ({
      ...prev,
      coins: prev.coins - SPIN_COST,
    }));

    setIsSpinning(true);
    setShowPrizeModal(false);
    setWinningReward(null);

    // Pick winning index according to probability weights
    const totalWeight = LUCKY_REWARDS.reduce((acc, r) => acc + r.probabilityWeight, 0);
    let randomNum = Math.random() * totalWeight;
    let chosenIndex = 0;
    for (let i = 0; i < LUCKY_REWARDS.length; i++) {
      if (randomNum < LUCKY_REWARDS[i].probabilityWeight) {
        chosenIndex = i;
        break;
      }
      randomNum -= LUCKY_REWARDS[i].probabilityWeight;
    }

    const selectedReward = LUCKY_REWARDS[chosenIndex];

    // Pointer is at TOP (0 deg / 12 o'clock).
    // Segment i occupies [i * segmentAngle, (i+1) * segmentAngle].
    // Segment center is at i * segmentAngle + (segmentAngle / 2).
    // To align the center with the top pointer (0° / 360°), rotation must be:
    // targetAngle = 360 - (center) + jitter
    const segmentCenter = chosenIndex * segmentAngle + segmentAngle / 2;
    // Add small organic jitter (-12 to +12 degrees) within the 45 degree wedge
    const jitter = (Math.random() - 0.5) * (segmentAngle * 0.5);
    const stopAngleOnWheel = (360 - segmentCenter + jitter + 360) % 360;

    // Minimum 5 full spins (1800°) + the current rotation offset
    const currentBase = rotation - (rotation % 360);
    const fullSpins = 360 * 6; // 6 spins
    const targetTotalRotation = currentBase + fullSpins + stopAngleOnWheel;

    setRotation(targetTotalRotation);

    // Audio ticks simulation during spin
    if (soundEnabled) {
      let tickCount = 0;
      const maxTicks = 25;
      const startTicks = () => {
        playTickSound();
        tickCount++;
        if (tickCount < maxTicks) {
          // Progressively slow down ticking frequency
          const delay = 70 + (tickCount * tickCount * 0.8);
          tickIntervalRef.current = window.setTimeout(startTicks, delay);
        }
      };
      startTicks();
    }

    // Spin animation duration is 4.5 seconds
    setTimeout(() => {
      setIsSpinning(false);
      setWinningReward(selectedReward);
      setShowPrizeModal(true);

      const newSpinCount = spinCount + 1;
      setSpinCount(newSpinCount);
      try {
        localStorage.setItem('social_live_lucky_spins_count', newSpinCount.toString());
      } catch {}

      if (soundEnabled) {
        playWinSound(selectedReward.rarity);
      }

      // Add to live drops
      setLiveDrops(prev => [
        {
          id: Date.now(),
          user: user.name || 'You',
          prize: selectedReward.name,
          icon: selectedReward.icon,
          rarity: selectedReward.rarity,
        },
        ...prev.slice(0, 4),
      ]);

      // If coins, credit directly
      if (selectedReward.type === 'coins') {
        const coinVal = Number(selectedReward.value);
        setUser(prev => ({
          ...prev,
          coins: prev.coins + coinVal,
        }));
        showToast?.(`🎉 Won ${coinVal} Coins on Lucky Wheel!`);
      } else if (selectedReward.type === 'badge') {
        const badgeName = String(selectedReward.value);
        setUser(prev => {
          const currentBadges = prev.badges || [];
          const updatedBadges = currentBadges.includes(badgeName) ? currentBadges : [...currentBadges, badgeName];
          return {
            ...prev,
            badges: updatedBadges,
            activeBadge: badgeName,
          };
        });
        showToast?.(`🎉 Unlocked & equipped "${badgeName}" badge!`);
      } else if (selectedReward.type === 'frame') {
        const frameUrl = String(selectedReward.value);
        setUser(prev => {
          const currentFrames = prev.unlockedFrames || [];
          const updatedFrames = currentFrames.includes(frameUrl) ? currentFrames : [...currentFrames, frameUrl];
          return {
            ...prev,
            unlockedFrames: updatedFrames,
            frameUrl: frameUrl,
          };
        });
        showToast?.(`🎉 Unlocked & equipped "${selectedReward.name}"!`);
      }
    }, 4500);
  };

  const handleEquipFrame = (frameUrl: string) => {
    setUser(prev => ({ ...prev, frameUrl }));
    showToast?.('Avatar frame equipped!');
  };

  const handleEquipBadge = (badge: string) => {
    setUser(prev => ({ ...prev, activeBadge: badge }));
    showToast?.(`Badge "${badge}" equipped!`);
  };

  const userBadges = user.badges || [];
  const userFrames = user.unlockedFrames || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 border border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-pink-500/25 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-4 pt-4 pb-2 flex items-center justify-between border-b border-purple-800/60 bg-black/40">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin-slow">🎡</span>
            <div>
              <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 tracking-wide uppercase">
                Lucky Wheel
              </h2>
              <p className="text-[10px] text-purple-200">
                Win Coins, Mythic Frames & Badges · 50 🪙
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full bg-purple-950/70 border border-purple-700/60 text-xs text-purple-200 hover:text-white"
              title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Coins Balance */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-bold text-yellow-300">
              <span>🪙</span>
              <span>{user.coins.toLocaleString()}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-700 text-gray-400 hover:text-white hover:bg-purple-900 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Live Drops Ticker */}
        <div className="relative z-10 bg-purple-950/60 border-b border-purple-800/40 px-3 py-1 flex items-center overflow-hidden">
          <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider mr-2 flex-shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Drops:
          </span>
          <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-3 text-[11px] text-gray-300 py-0.5">
            {liveDrops.map(drop => (
              <span key={drop.id} className="inline-flex items-center gap-1 text-purple-200">
                <span className="font-semibold text-white">@{drop.user}</span>
                <span className="text-gray-400">won</span>
                <span className="text-yellow-300 font-bold">
                  {drop.icon} {drop.prize}
                </span>
                <span className="text-gray-600">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-800/40 bg-black/20 px-4 pt-2">
          <button
            onClick={() => setActiveTab('wheel')}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'wheel'
                ? 'border-pink-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>🎯</span>
            <span>Spin & Win</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'border-pink-500 text-white'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>🎒</span>
            <span>My Rewards & Badges</span>
            {(userBadges.length > 0 || userFrames.length > 0) && (
              <span className="px-1.5 py-0.2 text-[9px] bg-pink-500/30 text-pink-300 rounded-full border border-pink-500/40">
                {userBadges.length + userFrames.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'wheel' ? (
            <div className="flex flex-col items-center">
              {/* Wheel Container with Rim and Pointer */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2">
                {/* Outer Glowing Neon Bezel */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400/80 shadow-[0_0_30px_rgba(234,179,8,0.4)] pointer-events-none" />

                {/* Animated Rim Bulbs */}
                <div className="absolute inset-1 rounded-full pointer-events-none">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const angle = (idx * 360) / 16;
                    const isEven = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className={`absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors ${
                          isSpinning
                            ? isEven
                              ? 'bg-yellow-300 shadow-[0_0_8px_#fde047]'
                              : 'bg-pink-400 shadow-[0_0_8px_#f472b6]'
                            : isEven
                            ? 'bg-amber-300'
                            : 'bg-yellow-200/50'
                        }`}
                        style={{
                          top: `${50 - 47 * Math.cos((angle * Math.PI) / 180)}%`,
                          left: `${50 + 47 * Math.sin((angle * Math.PI) / 180)}%`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* The Rotating Wheel (SVG) */}
                <div
                  className="w-[90%] h-[90%] rounded-full shadow-2xl relative"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.2, 1)'
                      : 'none',
                  }}
                >
                  <svg viewBox="0 0 400 400" className="w-full h-full rounded-full">
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Slices */}
                    {LUCKY_REWARDS.map((reward, i) => {
                      const startAngle = i * segmentAngle;
                      const endAngle = (i + 1) * segmentAngle;
                      const startRad = ((startAngle - 90) * Math.PI) / 180;
                      const endRad = ((endAngle - 90) * Math.PI) / 180;

                      const x1 = 200 + 200 * Math.cos(startRad);
                      const y1 = 200 + 200 * Math.sin(startRad);
                      const x2 = 200 + 200 * Math.cos(endRad);
                      const y2 = 200 + 200 * Math.sin(endRad);

                      const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;

                      const midAngle = startAngle + segmentAngle / 2;
                      const midRad = ((midAngle - 90) * Math.PI) / 180;
                      const iconX = 200 + 130 * Math.cos(midRad);
                      const iconY = 200 + 130 * Math.sin(midRad);
                      const textX = 200 + 80 * Math.cos(midRad);
                      const textY = 200 + 80 * Math.sin(midRad);

                      return (
                        <g key={reward.id}>
                          {/* Segment Wedge */}
                          <path
                            d={pathData}
                            fill={reward.color}
                            stroke="#1E1B4B"
                            strokeWidth="2.5"
                            className="transition-opacity hover:opacity-90"
                          />

                          {/* Segment Icon */}
                          <text
                            x={iconX}
                            y={iconY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="28"
                            transform={`rotate(${midAngle}, ${iconX}, ${iconY})`}
                          >
                            {reward.icon}
                          </text>

                          {/* Short Label */}
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="11"
                            fontWeight="bold"
                            fill="#FFFFFF"
                            transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                          >
                            {reward.name.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}

                    {/* Center decorative ring */}
                    <circle cx="200" cy="200" r="36" fill="#111827" stroke="#FBBF24" strokeWidth="4" />
                    <circle cx="200" cy="200" r="28" fill="#4338CA" />
                  </svg>
                </div>

                {/* Top Arrow Pointer (Target Selector) */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
                  <div className="w-7 h-9 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 rounded-b-md shadow-2xl flex items-center justify-center border-t-2 border-yellow-100">
                    <span className="text-[10px] font-black text-black">▼</span>
                  </div>
                </div>

                {/* Center Spin Button / Jewel */}
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`absolute z-20 w-16 h-16 rounded-full font-black text-xs uppercase tracking-wider flex flex-col items-center justify-center shadow-xl border-4 transition-all ${
                    isSpinning
                      ? 'bg-gray-800 text-gray-400 border-gray-600 scale-95'
                      : 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white border-yellow-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.6)] cursor-pointer'
                  }`}
                >
                  <span className="text-base">{isSpinning ? '⏳' : 'SPIN'}</span>
                  <span className="text-[9px] text-yellow-300 font-extrabold">50🪙</span>
                </button>
              </div>

              {/* Spin Action Buttons & Price Badge */}
              <div className="w-full mt-3 flex flex-col items-center gap-2">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || user.coins < SPIN_COST}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isSpinning
                      ? 'bg-purple-900/60 text-purple-300 cursor-not-allowed animate-pulse'
                      : user.coins < SPIN_COST
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white hover:opacity-95 hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] active:scale-98'
                  }`}
                >
                  {isSpinning ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Spinning Wheel...</span>
                    </>
                  ) : user.coins < SPIN_COST ? (
                    <span>Insufficient Coins (Need 50 🪙)</span>
                  ) : (
                    <>
                      <span>🎰</span>
                      <span>Spin for 50 Coins</span>
                      <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full text-yellow-300">
                        Balance: {user.coins.toLocaleString()}
                      </span>
                    </>
                  )}
                </button>

                {/* Prize Pool Legend */}
                <div className="w-full mt-3 p-3 rounded-2xl bg-black/40 border border-purple-900/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Featured Wheel Drops
                    </span>
                    <span className="text-[10px] text-purple-300">
                      Total Spins: {spinCount}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-yellow-950/40 border border-yellow-700/50">
                      <span className="text-xl">🪙</span>
                      <div>
                        <p className="font-bold text-yellow-300 leading-tight">1,000 Coins</p>
                        <p className="text-[10px] text-yellow-500/90">Legendary Jackpot</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-red-950/40 border border-red-700/50">
                      <span className="text-xl">🔥</span>
                      <div>
                        <p className="font-bold text-red-300 leading-tight">Phoenix Frame</p>
                        <p className="text-[10px] text-red-400/90">Mythic Profile Frame</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-purple-950/40 border border-purple-700/50">
                      <span className="text-xl">💎</span>
                      <div>
                        <p className="font-bold text-purple-300 leading-tight">Diamond Badge</p>
                        <p className="text-[10px] text-purple-400/90">Special Profile Badge</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-700/50">
                      <span className="text-xl">⚡</span>
                      <div>
                        <p className="font-bold text-cyan-300 leading-tight">Cyber Frame</p>
                        <p className="text-[10px] text-cyan-400/90">Neon Profile Frame</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* My Rewards & Unlocked Inventory Tab */
            <div className="space-y-4">
              <div className="p-3 bg-purple-950/40 rounded-2xl border border-purple-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Your Equipped Customizations</p>
                  <p className="text-[10px] text-gray-400">
                    Equip won frames & badges from the Lucky Wheel
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
                  />
                  {user.frameUrl && (
                    <img
                      src={user.frameUrl}
                      alt="Frame"
                      className="absolute inset-0 w-12 h-12 scale-125 pointer-events-none"
                    />
                  )}
                  {user.activeBadge && (
                    <div className="absolute -bottom-1 -right-1 text-xs bg-black/80 rounded-full px-1 border border-yellow-400">
                      {user.activeBadge.split(' ')[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Badges Section */}
              <div>
                <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🎖️</span> Special Badges ({userBadges.length})
                </h3>
                {userBadges.length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/30 border border-purple-900/40 text-center">
                    <p className="text-xs text-gray-400">No badges won yet.</p>
                    <p className="text-[11px] text-pink-400 mt-1">
                      Spin the Lucky Wheel for a chance to drop special badges!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userBadges.map((badge, idx) => {
                      const isEquipped = user.activeBadge === badge;
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            isEquipped
                              ? 'bg-purple-900/40 border-pink-500'
                              : 'bg-black/40 border-purple-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{badge.split(' ')[0]}</span>
                            <div>
                              <p className="text-xs font-bold text-white">{badge}</p>
                              <p className="text-[10px] text-emerald-400">Unlocked & Verified</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEquipBadge(isEquipped ? '' : badge)}
                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                              isEquipped
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            {isEquipped ? 'Equipped ✓' : 'Equip'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Frames Section */}
              <div>
                <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>🖼️</span> Avatar Profile Frames ({userFrames.length})
                </h3>
                {userFrames.length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/30 border border-purple-900/40 text-center">
                    <p className="text-xs text-gray-400">No avatar frames won yet.</p>
                    <p className="text-[11px] text-pink-400 mt-1">
                      Spin the wheel to win Cyber Neon, Phoenix Fire & Astronaut frames!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {userFrames.map((frame, idx) => {
                      const isEquipped = user.frameUrl === frame;
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                            isEquipped
                              ? 'bg-purple-900/40 border-pink-500'
                              : 'bg-black/40 border-purple-800/60'
                          }`}
                        >
                          <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
                            <img
                              src={user.avatar}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <img
                              src={frame}
                              alt="Frame"
                              className="absolute inset-0 w-14 h-14 object-contain"
                            />
                          </div>
                          <button
                            onClick={() => handleEquipFrame(isEquipped ? '' : frame)}
                            className={`w-full py-1 text-xs font-bold rounded-lg transition-all ${
                              isEquipped
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }`}
                          >
                            {isEquipped ? 'Active Frame' : 'Use Frame'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Victory Prize Modal Overlay */}
        {showPrizeModal && winningReward && (
          <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            {/* Confetti and Glow */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(234,179,8,0.7)] animate-bounce mb-3">
              {winningReward.icon}
            </div>

            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 mb-2">
              {winningReward.rarityBadge} PRIZE
            </span>

            <h3 className="text-2xl font-black text-white mb-1">
              Congratulations!
            </h3>
            <p className="text-sm font-bold text-pink-300 mb-2">
              You won {winningReward.name}!
            </p>
            <p className="text-xs text-gray-400 max-w-xs mb-6">
              {winningReward.description}
            </p>

            {/* Quick action buttons */}
            <div className="w-full max-w-xs space-y-2">
              <button
                onClick={() => {
                  setShowPrizeModal(false);
                  handleSpin();
                }}
                disabled={user.coins < SPIN_COST}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-pink-500 hover:opacity-90 text-white font-extrabold rounded-xl shadow-lg transition-all"
              >
                Spin Again (50 🪙)
              </button>

              <button
                onClick={() => setShowPrizeModal(false)}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-xs transition-colors"
              >
                Awesome! Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyWheelModal;
