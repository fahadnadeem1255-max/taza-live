import React from 'react';
import type { User, View } from '../types';

interface DiscoverScreenProps {
    users: User[];
    onNavigate: (view: View) => void;
    onViewProfile: (user: User) => void;
    showToast: (message: string) => void;
}

const UserCard: React.FC<{ user: User; onClick: () => void; }> = ({ user, onClick }) => (
    <div 
        onClick={onClick} 
        className="flex flex-col items-center text-center cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
    >
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-purple-500" />
        <p className="mt-2 text-sm font-semibold truncate w-full">{user.name}</p>
    </div>
);


const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ users, onNavigate, onViewProfile, showToast }) => {
  return (
    <div className="h-screen flex flex-col text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-purple-900 flex-shrink-0">
        <button 
            onClick={() => onNavigate('myRoom')}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity"
        >
            Start
        </button>
        <button 
            onClick={() => showToast('Search feature coming soon!')}
            className="p-2 text-gray-300 hover:text-white"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </header>
      
      {/* User Grid */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-4">
            {users.map(user => (
                <UserCard key={user.id} user={user} onClick={() => onViewProfile(user)} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;