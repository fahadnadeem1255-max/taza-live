import React, { useState } from 'react';
import type { User } from '../types';

interface BlockListScreenProps {
  blockedUserIds: string[];
  allUsers: User[];
  onUnblock: (userId: string) => void;
  onBack: () => void;
  onViewProfile?: (user: User) => void;
}

const BlockListScreen: React.FC<BlockListScreenProps> = ({
  blockedUserIds,
  allUsers,
  onUnblock,
  onBack,
  onViewProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userToUnblock, setUserToUnblock] = useState<User | null>(null);

  // Map blocked IDs to full user objects; provide fallback for any ID not found
  const blockedUsers: User[] = blockedUserIds.map(id => {
    const found = allUsers.find(u => u.id === id);
    if (found) return found;
    return {
      id,
      name: `User ${id}`,
      username: `User_${id}`,
      idNumber: id,
      avatar: 'https://i.pravatar.cc/150?u=' + id,
      bio: '',
      coins: 0,
      points: 0,
      follow: 0,
      friends: 0,
      fans: 0,
      vipLevel: 0,
      vipBadgeUrl: '',
    };
  });

  const filteredBlockedUsers = blockedUsers.filter(u => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.idNumber.toLowerCase().includes(query)
    );
  });

  const handleConfirmUnblock = () => {
    if (userToUnblock) {
      onUnblock(userToUnblock.id);
      setUserToUnblock(null);
    }
  };

  return (
    <div className="p-4 h-screen flex flex-col text-white bg-gradient-to-br from-indigo-950 via-black to-purple-950">
      {/* Header */}
      <header className="relative flex items-center justify-center mb-4 h-12 flex-shrink-0">
        <button
          onClick={onBack}
          aria-label="Back"
          className="absolute left-0 p-2 text-gray-300 hover:text-white rounded-full bg-black/40 hover:bg-black/60 border border-purple-800/40 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Block List
        </h1>
        <span className="absolute right-2 text-xs font-semibold px-2.5 py-1 bg-red-950/80 border border-red-500/40 text-red-300 rounded-full">
          {blockedUserIds.length}
        </span>
      </header>

      {/* Info notice banner */}
      <div className="mb-4 p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-start gap-3 backdrop-blur-sm">
        <span className="text-xl flex-shrink-0">🛡️</span>
        <p className="text-xs text-purple-200/90 leading-relaxed">
          Blocked users cannot search for you, send you messages, view your rooms, or interact with your profile.
        </p>
      </div>

      {/* Search Input when there are blocked users */}
      {blockedUsers.length > 0 && (
        <div className="relative mb-4 flex-shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search blocked users by name or ID..."
            className="w-full bg-black/60 border border-purple-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-3.5 top-3.5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* List / Empty State */}
      <div className="flex-grow overflow-y-auto space-y-2.5 pb-20">
        {blockedUsers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div className="w-20 h-20 rounded-full bg-purple-900/30 border border-purple-700/50 flex items-center justify-center text-3xl mb-4 shadow-inner">
              ✨
            </div>
            <h2 className="text-lg font-bold text-white mb-1">No Blocked Users</h2>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Your block list is empty. When you block someone from their profile, they will be listed here.
            </p>
          </div>
        ) : filteredBlockedUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No blocked users matching &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          filteredBlockedUsers.map(targetUser => (
            <div
              key={targetUser.id}
              className="p-3.5 rounded-xl bg-black/60 border border-purple-900/60 flex items-center justify-between hover:border-purple-700/60 transition-all shadow-md backdrop-blur-sm"
            >
              <div
                className="flex items-center gap-3 cursor-pointer min-w-0"
                onClick={() => onViewProfile && onViewProfile(targetUser)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={targetUser.avatar}
                    alt={targetUser.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-red-500/60 grayscale-[40%]"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs bg-red-600 text-white rounded-full p-0.5" title="Blocked">
                    🚫
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-white truncate">{targetUser.username || targetUser.name}</p>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60">
                      Blocked
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">ID: {targetUser.idNumber}</p>
                </div>
              </div>

              <button
                onClick={() => setUserToUnblock(targetUser)}
                className="flex-shrink-0 ml-3 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-gray-800 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                Unblock
              </button>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {userToUnblock && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setUserToUnblock(null)}
        >
          <div
            className="bg-gray-900 border border-purple-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <img
                src={userToUnblock.avatar}
                alt={userToUnblock.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
              />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Unblock {userToUnblock.username || userToUnblock.name}?
            </h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              They will be able to search for your profile, view your rooms, and interact with you again.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserToUnblock(null)}
                className="py-2.5 rounded-xl text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnblock}
                className="py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-md shadow-pink-500/20"
              >
                Unblock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockListScreen;
