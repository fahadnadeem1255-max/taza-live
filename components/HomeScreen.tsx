import React, { useState, useRef, useEffect } from 'react';
import type { Room, RoomType, User, DailyMission } from '../types';
import { allCountriesForFilter, mockDailyMissions, mockUser } from '../constants';
import DailyCheckInModal, { CHECK_IN_DAYS } from './DailyCheckInModal';
import DailyMissionsModal from './DailyMissionsModal';
import LuckyWheelModal from './LuckyWheelModal';

interface RoomCardProps {
  room: Room;
  onJoin: (room: Room) => void;
  size?: 'large' | 'small';
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin, size = 'large' }) => {
  const Icon = () => room.type === 'video' 
    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a1 1 0 000 2h1a1 1 0 000-2H5zM2 3a1 1 0 000 2h1a1 1 0 000-2H2zM8 3a1 1 0 000 2h1a1 1 0 000-2H8zM11 3a1 1 0 000 2h1a1 1 0 000-2h-1zM2 7a1 1 0 000 2h1a1 1 0 000-2H2zM5 7a1 1 0 000 2h1a1 1 0 000-2H5zM8 7a1 1 0 000 2h1a1 1 0 000-2H8zM11 7a1 1 0 000 2h1a1 1 0 000-2h-1zM2 11a1 1 0 000 2h1a1 1 0 000-2H2zM5 11a1 1 0 000 2h1a1 1 0 000-2H5zM8 11a1 1 0 000 2h1a1 1 0 000-2H8zM11 11a1 1 0 000 2h1a1 1 0 000-2h-1zM14 4a1 1 0 011 1v1a1 1 0 01-2 0V5a1 1 0 011-1zM3 15a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>;
    
  const isLarge = size === 'large';

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-black/50 border border-purple-900 cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => onJoin(room)}>
      <div className="relative">
        <img className={`w-full ${isLarge ? 'h-40' : 'h-28'} object-cover`} src={room.coverImage} alt={room.title} />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs flex items-center gap-1">
          <Icon />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
          <span>{room.viewers}</span>
        </div>
      </div>
      <div className={isLarge ? 'p-3' : 'p-2'}>
        <h3 className={`font-bold ${isLarge ? 'text-sm' : 'text-xs'} truncate text-white`}>{room.title}</h3>
        <div className="flex items-center mt-1">
          <img className={`rounded-full ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} src={room.host.avatar} alt={room.host.name} />
          <p className={`text-gray-400 ${isLarge ? 'text-xs' : 'text-[10px]'} ml-2 truncate`}>{room.host.name}</p>
        </div>
      </div>
    </div>
  );
}

interface HomeScreenProps {
  rooms: Room[];
  onJoinRoom: (room: Room) => void;
  user?: User;
  setUser?: React.Dispatch<React.SetStateAction<User>>;
  showToast?: (message: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ rooms, onJoinRoom, user, setUser, showToast }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [selectedCountry, setSelectedCountry] = useState({ name: 'Global', flag: '🌍' });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);

  // Daily Check-in & Streak State with LocalStorage Persistence
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInData, setCheckInData] = useState(() => {
    try {
      const saved = localStorage.getItem('social_live_daily_checkin');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Ignore fallback
    }
    return {
      streak: user?.checkInStreak ?? 3,
      hasCheckedInToday: false,
      currentCycleDay: 3,
      claimedDays: [1, 2],
      lastCheckInDate: '',
    };
  });

  // Sync streak to User if updated
  useEffect(() => {
    if (user && user.checkInStreak !== undefined && user.checkInStreak !== checkInData.streak) {
      setCheckInData(prev => ({ ...prev, streak: user.checkInStreak || prev.streak }));
    }
  }, [user?.checkInStreak]);

  const handleCountrySelect = (country: { name: string; flag: string; }) => {
      setSelectedCountry(country);
      setIsCountryDropdownOpen(false);
  };

  const handleCheckIn = () => {
    if (checkInData.hasCheckedInToday) {
      showToast?.('You already checked in today! Come back tomorrow.');
      return;
    }

    const todayDayItem = CHECK_IN_DAYS.find(d => d.day === checkInData.currentCycleDay) || CHECK_IN_DAYS[0];
    const rewardCoins = todayDayItem.coins;
    const newStreak = checkInData.streak + 1;
    const newClaimedDays = checkInData.claimedDays.includes(checkInData.currentCycleDay)
      ? checkInData.claimedDays
      : [...checkInData.claimedDays, checkInData.currentCycleDay];
    const todayDate = new Date().toISOString().split('T')[0];

    const updated = {
      ...checkInData,
      streak: newStreak,
      hasCheckedInToday: true,
      claimedDays: newClaimedDays,
      lastCheckInDate: todayDate,
    };

    setCheckInData(updated);
    try {
      localStorage.setItem('social_live_daily_checkin', JSON.stringify(updated));
    } catch (e) {}

    // Update global user coins and streak
    if (setUser) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins + rewardCoins,
        checkInStreak: newStreak,
        hasCheckedInToday: true,
      }));
    }

    showToast?.(`🎉 Checked in! +${rewardCoins} Coins added to your wallet! Streak: ${newStreak} Days 🔥`);
  };

  const handleSimulateNextDay = () => {
    const nextCycleDay = checkInData.currentCycleDay >= 7 ? 1 : checkInData.currentCycleDay + 1;
    const nextClaimedDays = checkInData.currentCycleDay >= 7 ? [] : checkInData.claimedDays;
    const updated = {
      ...checkInData,
      hasCheckedInToday: false,
      currentCycleDay: nextCycleDay,
      claimedDays: nextClaimedDays,
    };

    setCheckInData(updated);
    try {
      localStorage.setItem('social_live_daily_checkin', JSON.stringify(updated));
    } catch (e) {}

    showToast?.(`⏩ Advanced to Day ${nextCycleDay}! Daily check-in reward unlocked.`);
  };

  // Daily Missions State with LocalStorage Persistence
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [missions, setMissions] = useState<DailyMission[]>(() => {
    try {
      const saved = localStorage.getItem('social_live_daily_missions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return mockDailyMissions;
  });

  useEffect(() => {
    try {
      localStorage.setItem('social_live_daily_missions', JSON.stringify(missions));
    } catch (e) {}
  }, [missions]);

  const handleUpdateMission = (missionId: string, delta: number) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id !== missionId) return m;
        const newProgress = Math.max(0, Math.min(m.targetProgress, m.currentProgress + delta));
        return { ...m, currentProgress: newProgress };
      })
    );
    showToast?.('Mission progress updated!');
  };

  const handleClaimMission = (mission: DailyMission) => {
    if (mission.isClaimed) return;
    if (mission.currentProgress < mission.targetProgress) {
      showToast?.('Complete the mission first to claim rewards!');
      return;
    }

    setMissions(prev =>
      prev.map(m => (m.id === mission.id ? { ...m, isClaimed: true } : m))
    );

    if (setUser) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins + mission.rewardCoins,
      }));
    }

    showToast?.(`🎉 Claimed +${mission.rewardCoins} Coins for "${mission.title}"!`);
  };

  const handleClaimAllMissions = () => {
    const readyMissions = missions.filter(m => m.currentProgress >= m.targetProgress && !m.isClaimed);
    if (readyMissions.length === 0) return;

    const totalCoins = readyMissions.reduce((sum, m) => sum + m.rewardCoins, 0);

    setMissions(prev =>
      prev.map(m =>
        m.currentProgress >= m.targetProgress ? { ...m, isClaimed: true } : m
      )
    );

    if (setUser) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins + totalCoins,
      }));
    }

    showToast?.(`🎉 Claimed all ready missions! +${totalCoins} Coins added to your wallet!`);
  };

  const completedMissionsCount = missions.filter(m => m.currentProgress >= m.targetProgress).length;
  const readyMissionsCount = missions.filter(m => m.currentProgress >= m.targetProgress && !m.isClaimed).length;
  const totalMissionsCount = missions.length;
  const missionsProgressPercentage = Math.round((completedMissionsCount / totalMissionsCount) * 100);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredRooms = rooms.filter(room => {
    const typeMatch = activeFilter === 'all' || room.type === activeFilter;
    const countryMatch = selectedCountry.name === 'Global' || room.country === selectedCountry.name;
    
    const titleMatch = room.title.toLowerCase().includes(normalizedQuery);
    const hostNameMatch = room.host?.name?.toLowerCase().includes(normalizedQuery);
    const hostUsernameMatch = room.host?.username ? room.host.username.toLowerCase().includes(normalizedQuery) : false;
    const searchMatch = !normalizedQuery || titleMatch || hostNameMatch || hostUsernameMatch;

    return typeMatch && countryMatch && searchMatch;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => b.viewers - a.viewers);
  const isSearching = normalizedQuery.length > 0;
  const topRooms = sortedRooms.slice(0, 3);
  const otherRooms = sortedRooms.slice(3);

  const todayReward = CHECK_IN_DAYS.find(d => d.day === checkInData.currentCycleDay) || CHECK_IN_DAYS[0];

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Top User Status & Login Streak Badge Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-purple-500/60 object-cover"
            />
          )}
          <div>
            <p className="text-xs font-bold text-white leading-tight">
              {user?.name || 'Live Streamer'}
            </p>
            <p className="text-[10px] text-gray-400">ID: {user?.idNumber || '818100'}</p>
          </div>
        </div>

        {/* Current Login Streak Badge, Missions Badge, & Coins Chip */}
        <div className="flex items-center gap-1.5">
          {/* Lucky Wheel Quick Action */}
          <button
            onClick={() => setIsLuckyWheelOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-pink-500/25 to-purple-600/30 border border-yellow-500/60 hover:border-yellow-400 text-xs font-black text-yellow-300 shadow-md transition-all hover:scale-105 active:scale-95 animate-pulse"
            title="Lucky Wheel - 50 Coins per spin"
            aria-label="Lucky Wheel - 50 Coins per spin"
          >
            <span className="text-sm">🎡</span>
            <span className="hidden sm:inline">Wheel</span>
            <span className="text-[10px] text-yellow-300 font-extrabold bg-yellow-500/20 px-1 py-0.2 rounded-full border border-yellow-500/40">
              50🪙
            </span>
          </button>

          {/* Daily Missions Shortcut Badge */}
          <button
            onClick={() => setIsMissionsModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-950/70 border border-purple-500/60 hover:border-pink-400 text-xs font-bold text-purple-200 hover:text-white shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Daily Missions Dashboard"
            aria-label="Daily Missions Dashboard"
          >
            <span>🎯</span>
            <span className="hidden sm:inline">Missions</span>
            <span className="text-[10px] text-pink-300 font-extrabold bg-pink-500/20 px-1.5 py-0.2 rounded-full border border-pink-500/40">
              {completedMissionsCount}/{totalMissionsCount}
            </span>
            {readyMissionsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5" />
            )}
          </button>

          {/* Login Streak Badge */}
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/25 via-pink-500/25 to-purple-600/30 border border-orange-500/60 hover:border-orange-400 text-xs font-extrabold text-orange-300 shadow-md transition-all hover:scale-105 active:scale-95"
            title="Daily Check-in Streak"
            aria-label="View Daily Check-in Streak"
          >
            <span className="text-sm animate-flame">🔥</span>
            <span>{checkInData.streak}D</span>
            {!checkInData.hasCheckedInToday && (
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping ml-0.5" />
            )}
          </button>

          {/* User Coins Balance Chip */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-bold shadow-sm">
            <span>🪙</span>
            <span>{(user?.coins ?? 184571).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Top Filter Tabs and Country Picker */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <div className="flex items-center justify-center p-1 bg-black/50 rounded-full border border-purple-800">
          {(['all', 'audio', 'video'] as const).map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
                activeFilter === type ? 'bg-pink-600 text-white' : 'text-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-full transition-colors ${
              searchQuery ? 'bg-pink-600 text-white' : 'bg-black/50 text-white hover:bg-purple-900/60'
            }`}
            onClick={() => searchInputRef.current?.focus()}
            title="Search rooms"
            aria-label="Search rooms"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="flex items-center gap-2 bg-black/50 p-2 rounded-full text-white"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {isCountryDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-purple-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {allCountriesForFilter.map(country => (
                  <button
                    key={country.name}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full text-left p-2 hover:bg-purple-600 flex items-center gap-3 text-white"
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Search Input Bar */}
      <div className="relative mb-3 flex-shrink-0">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rooms by title or host name..."
            className="w-full pl-10 pr-9 py-2 bg-black/60 border border-purple-800/80 rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
              title="Clear search"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Lucky Wheel Engagement Banner (shown when not actively searching) */}
      {!isSearching && (
        <div
          onClick={() => setIsLuckyWheelOpen(true)}
          className="mb-3.5 flex-shrink-0 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/70 to-pink-950/60 border border-yellow-500/50 p-3 shadow-lg relative overflow-hidden backdrop-blur-sm cursor-pointer hover:border-yellow-400 transition-all group"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-yellow-500/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg border border-yellow-200/50 group-hover:rotate-12 transition-transform flex-shrink-0">
                🎡
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Lucky Wheel
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[9px] font-black uppercase">
                    Win 1,000🪙
                  </span>
                </div>
                <p className="text-[11px] text-purple-200 truncate mt-0.5">
                  Spin for 50 Coins · Win Coins, Mythic Frames & Rare Badges
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLuckyWheelOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow-md group-hover:shadow-[0_0_15px_rgba(234,179,8,0.5)] active:scale-95 transition-all flex-shrink-0 flex items-center gap-1"
            >
              <span>Spin</span>
              <span className="text-[10px] text-yellow-100 font-extrabold bg-black/20 px-1 py-0.2 rounded">50🪙</span>
            </button>
          </div>
        </div>
      )}

      {/* Daily Check-in Interactive Feature Card (shown when not actively searching) */}
      {!isSearching && (
        <div className="mb-4 flex-shrink-0 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/40 border border-purple-700/60 p-3.5 shadow-lg relative overflow-hidden backdrop-blur-sm">
          {/* Subtle background flare */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-pink-500/15 rounded-full blur-xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-base animate-flame">🔥</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Daily Check-in
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-[10px] font-extrabold text-orange-300">
                {checkInData.streak}D Streak
              </span>
            </div>

            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-0.5 transition-colors"
            >
              <span>View All</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Mini 7-Day Streak Tracker */}
          <div className="grid grid-cols-7 gap-1 mb-2.5">
            {CHECK_IN_DAYS.map((dayItem) => {
              const isClaimed = checkInData.claimedDays.includes(dayItem.day);
              const isToday = dayItem.day === checkInData.currentCycleDay;
              const isPendingToday = isToday && !checkInData.hasCheckedInToday;

              return (
                <div
                  key={dayItem.day}
                  onClick={() => setIsCheckInModalOpen(true)}
                  className={`rounded-lg py-1 px-0.5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isClaimed
                      ? 'bg-emerald-950/40 border border-emerald-500/40'
                      : isPendingToday
                      ? 'bg-pink-600/30 border border-pink-400 shadow-sm shadow-pink-500/30 scale-105'
                      : isToday && checkInData.hasCheckedInToday
                      ? 'bg-emerald-950/40 border border-emerald-400'
                      : 'bg-black/30 border border-purple-900/50 opacity-60'
                  }`}
                >
                  <span className="text-[9px] text-gray-400 leading-none">D{dayItem.day}</span>
                  <span className="text-xs my-0.5">{dayItem.icon}</span>
                  <span className="text-[9px] font-bold text-yellow-300 leading-none">
                    +{dayItem.coins}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-purple-800/30">
            <div className="text-[11px] text-gray-300">
              {!checkInData.hasCheckedInToday ? (
                <span>
                  Today: Day {checkInData.currentCycleDay} reward is <strong className="text-yellow-300">+{todayReward.coins} coins</strong>
                </span>
              ) : (
                <span className="text-emerald-300 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Checked in today (+{todayReward.coins} claimed)</span>
                </span>
              )}
            </div>

            {!checkInData.hasCheckedInToday ? (
              <button
                onClick={handleCheckIn}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-md active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Check In</span>
                <span>+{todayReward.coins}🪙</span>
              </button>
            ) : (
              <button
                onClick={() => setIsCheckInModalOpen(true)}
                className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-purple-950/60 border border-purple-700/60 text-purple-200 hover:bg-purple-900/60 transition-colors"
              >
                Streak: {checkInData.streak}D 🔥
              </button>
            )}
          </div>
        </div>
      )}

      {/* Daily Missions Interactive Dashboard Card (shown when not actively searching) */}
      {!isSearching && (
        <div className="mb-4 flex-shrink-0 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/50 to-pink-950/40 border border-purple-600/60 p-3.5 shadow-lg relative overflow-hidden backdrop-blur-sm">
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Daily Missions
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-[10px] font-extrabold text-pink-300">
                    {completedMissionsCount}/{totalMissionsCount} Done
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMissionsModalOpen(true)}
              className="text-[11px] font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-0.5 transition-colors"
            >
              <span>Dashboard</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Overall Missions Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-purple-900/60">
              <div
                className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(missionsProgressPercentage > 0 ? 5 : 0, missionsProgressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Missions List with Progress Bars */}
          <div className="space-y-2">
            {missions.slice(0, 3).map((mission) => {
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
                  className="p-2.5 rounded-xl bg-black/40 border border-purple-900/50 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{mission.icon}</span>
                      <span className="text-xs font-bold text-white truncate">{mission.title}</span>
                      <span className="text-[10px] text-yellow-300 font-extrabold flex-shrink-0">
                        +{mission.rewardCoins}🪙
                      </span>
                    </div>

                    {isClaimed ? (
                      <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/40">
                        Claimed ✓
                      </span>
                    ) : isReadyToClaim ? (
                      <button
                        onClick={() => handleClaimMission(mission)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-extrabold text-[10px] shadow active:scale-95 animate-pulse"
                      >
                        Claim +{mission.rewardCoins}🪙
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateMission(mission.id, 1)}
                        className="px-2 py-0.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 text-[10px] font-semibold border border-purple-700/50"
                      >
                        Do It (+1)
                      </button>
                    )}
                  </div>

                  {/* Mission Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-black/60 rounded-full h-1.5 overflow-hidden border border-purple-900/60">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                            : 'bg-gradient-to-r from-pink-500 to-purple-500'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 flex-shrink-0">
                      {mission.currentProgress}/{mission.targetProgress} {mission.unit || ''} ({progressPercentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer link to open full missions dashboard */}
          <div className="mt-2.5 pt-2 border-t border-purple-800/30 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">
              {readyMissionsCount > 0 ? (
                <span className="text-amber-300 font-bold">🎁 {readyMissionsCount} rewards ready to claim!</span>
              ) : (
                <span>Earn bonus coins daily</span>
              )}
            </span>

            <button
              onClick={() => setIsMissionsModalOpen(true)}
              className="px-3 py-1 rounded-xl bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700/60 text-white font-bold text-[10px] transition-colors"
            >
              View All {totalMissionsCount} Missions ➔
            </button>
          </div>
        </div>
      )}
      
      {/* Rooms grid */}
      <div className="flex-grow overflow-y-auto pr-0.5">
        {sortedRooms.length > 0 ? (
          isSearching ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  Search Results
                </h2>
                <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-700/60">
                  {sortedRooms.length} {sortedRooms.length === 1 ? 'room' : 'rooms'} found
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {sortedRooms.map(room => (
                  <RoomCard key={room.id} room={room} onJoin={onJoinRoom} size="large" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Rooms Section */}
              {topRooms.length > 0 && (
                  <div>
                      <h2 className="text-xl font-bold text-pink-400 mb-3">Top Rooms</h2>
                      <div className="grid grid-cols-2 gap-4">
                          {topRooms.map(room => (
                            <RoomCard key={room.id} room={room} onJoin={onJoinRoom} size="large" />
                          ))}
                      </div>
                  </div>
              )}

              {/* Other Rooms Section */}
              {otherRooms.length > 0 && (
                  <div>
                      <h2 className="text-xl font-bold text-teal-400 mb-3">Explore</h2>
                      <div className="grid grid-cols-3 gap-3">
                          {otherRooms.map(room => (
                            <RoomCard key={room.id} room={room} onJoin={onJoinRoom} size="small" />
                          ))}
                      </div>
                  </div>
              )}
            </div>
          )
        ) : (
          isSearching ? (
            <div className="flex-grow flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-purple-900/40 border border-purple-700/50 flex items-center justify-center text-purple-300 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-white font-semibold text-base">No rooms match your search</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Couldn't find any rooms or hosts matching "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center h-full py-16 text-center">
                <p className="text-gray-500">No rooms found for {selectedCountry.name}.</p>
            </div>
          )
        )}
      </div>

      {/* Full Daily Check-in Modal */}
      <DailyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        streak={checkInData.streak}
        hasCheckedInToday={checkInData.hasCheckedInToday}
        currentCycleDay={checkInData.currentCycleDay}
        claimedDays={checkInData.claimedDays}
        onClaim={handleCheckIn}
        onSimulateNextDay={handleSimulateNextDay}
      />

      {/* Full Daily Missions Dashboard Modal */}
      <DailyMissionsModal
        isOpen={isMissionsModalOpen}
        onClose={() => setIsMissionsModalOpen(false)}
        missions={missions}
        onUpdateMission={handleUpdateMission}
        onClaimReward={handleClaimMission}
        onClaimAllReady={handleClaimAllMissions}
        user={user}
      />

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
        user={user || mockUser}
        setUser={setUser || (() => {})}
        showToast={showToast}
      />
    </div>
  );
};

export default HomeScreen;