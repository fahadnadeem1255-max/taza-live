import React, { useState, useMemo } from 'react';
import type { User, View } from '../types';

interface DiscoverScreenProps {
  users: User[];
  blockedUserIds?: string[];
  onNavigate: (view: View) => void;
  onViewProfile: (user: User) => void;
  showToast: (message: string) => void;
}

const UserCard: React.FC<{ user: User; onClick: () => void }> = ({ user, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center text-center cursor-pointer p-3 rounded-2xl bg-black/40 hover:bg-purple-900/30 border border-purple-900/40 hover:border-purple-600/60 transition-all duration-200 active:scale-95 group shadow-md"
  >
    <div className="relative">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-500 group-hover:border-pink-500 transition-colors shadow-lg"
      />
      {user.vipLevel > 0 && (
        <span className="absolute bottom-0 right-0 text-[10px] bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold px-1.5 py-0.2 rounded-full border border-yellow-300 shadow-sm">
          V{user.vipLevel}
        </span>
      )}
    </div>
    <p className="mt-2 text-sm font-semibold truncate w-full text-white group-hover:text-pink-300 transition-colors">
      {user.username || user.name}
    </p>
    <p className="text-[11px] text-gray-400 truncate w-full">ID: {user.idNumber}</p>
    <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-purple-300 font-medium">
      <span>👥</span>
      <span>{(user.followers ?? user.fans ?? 0).toLocaleString()}</span>
    </div>
  </div>
);

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  users,
  blockedUserIds = [],
  onNavigate,
  onViewProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter out blocked users first
  const unblockedUsers = useMemo(() => {
    return users.filter(user => !blockedUserIds.includes(user.id));
  }, [users, blockedUserIds]);

  // Apply search query filter
  const displayedUsers = useMemo(() => {
    if (!searchQuery.trim()) return unblockedUsers;
    const query = searchQuery.toLowerCase().trim();
    return unblockedUsers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.idNumber.toLowerCase().includes(query) ||
      (user.bio && user.bio.toLowerCase().includes(query))
    );
  }, [unblockedUsers, searchQuery]);

  return (
    <div className="h-screen flex flex-col text-white bg-gradient-to-br from-indigo-950 via-black to-purple-950">
      {/* Header */}
      <header className="p-4 border-b border-purple-900/60 flex-shrink-0 backdrop-blur-md bg-black/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Discover
            </h1>
            <span className="text-xs text-purple-300/80 bg-purple-900/40 border border-purple-700/40 px-2 py-0.5 rounded-full">
              {displayedUsers.length} users
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(prev => !prev)}
              aria-label="Toggle search"
              className={`p-2 rounded-full border transition-all ${
                isSearchOpen
                  ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                  : 'bg-black/40 border-purple-800/60 text-gray-300 hover:text-white hover:border-purple-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => onNavigate('myRoom')}
              className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-pink-500/20"
            >
              Start Room
            </button>
          </div>
        </div>

        {/* Live Search Bar (collapsible or persistent toggle) */}
        {isSearchOpen && (
          <div className="mt-3 relative animate-fade-in">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by username, short name, or ID..."
              className="w-full bg-black/60 border border-purple-700/80 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 shadow-inner"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute left-3.5 top-3 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </header>

      {/* User Grid */}
      <div className="flex-grow overflow-y-auto p-4 pb-28">
        {displayedUsers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-800/50 flex items-center justify-center text-2xl mb-3">
              🔍
            </div>
            <p className="text-sm font-semibold text-white">No users found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              {searchQuery
                ? `No active users match "${searchQuery}". (Blocked users are excluded from searches)`
                : 'All available users are currently filtered or blocked.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-3 py-1 text-xs bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-lg border border-purple-600/40"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {displayedUsers.map(user => (
              <UserCard key={user.id} user={user} onClick={() => onViewProfile(user)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;