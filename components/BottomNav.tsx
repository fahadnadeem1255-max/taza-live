import React from 'react';
import type { View } from '../types';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full transition-colors duration-200 relative ${
      isActive ? 'text-green-400' : 'text-gray-400 hover:text-green-400'
    }`}
  >
    {icon}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);

// --- SVG Icons to match the screenshot ---
const HomeIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg>
);
const DiscoverIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 15a.75.75 0 0 0-1.5 0v.01a.75.75 0 0 0 1.5 0V15Zm-3.75 1.5a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm0-3a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm12-3.75a.75.75 0 0 0 0-1.5h-.01a.75.75 0 0 0 0 1.5h.01ZM12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5ZM4.125 12a7.875 7.875 0 1 1 15.75 0 7.875 7.875 0 0 1-15.75 0Z" /></svg>
);
const InboxIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543l-.52 2.176a.75.75 0 00.925.826l2.106-.527a.75.75 0 00.504-.254z" clipRule="evenodd" />
    </svg>
);
const ProfileIcon = ({ className = "w-7 h-7" }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.625 16.5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Z" /><path fillRule="evenodd" d="M19.5 9.75a.75.75 0 0 1-.75.75h-.943a6.753 6.753 0 0 0-5.306-3.751v-.943a.75.75 0 0 1 1.5 0v.193a5.25 5.25 0 0 1 4.5 4.25Z" clipRule="evenodd" /><path d="M7.151 21.001a6.726 6.726 0 0 1-5.304-6.054c.488-.041 1.05-.16 1.635-.371a.75.75 0 0 0 .495-1.037 5.215 5.215 0 0 1-.22-1.075 5.25 5.25 0 0 1 9.94-1.201a.75.75 0 0 0 1.25-.826A6.75 6.75 0 0 0 7.5 4.5v-.943a.75.75 0 0 0-1.5 0v.943a6.753 6.753 0 0 0-3.751 5.306H1.5a.75.75 0 0 0 0 1.5h.707a6.726 6.726 0 0 0 6.054 5.304c.041-.488.16-.95.371-1.335a.75.75 0 0 0-1.037-.495c-.586.214-1.147.33-1.635.371Z" /></svg>
);


const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-black/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.2)] flex justify-around items-center h-24 rounded-t-3xl border-t border-gray-800">
      <NavItem icon={<HomeIcon />} label="Room" isActive={activeView === 'home'} onClick={() => setActiveView('home')} />
      <NavItem icon={<DiscoverIcon />} label="Discover" isActive={activeView === 'discover'} onClick={() => setActiveView('discover')} />
      
      <div className="flex flex-col items-center">
        <button onClick={() => setActiveView('myRoom')} className="relative -top-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/50">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm-1.5 3a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-9Zm8.25-1.5a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm2.25 0a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm2.25 0a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm2.25 0a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Z" /></svg>
          </div>
        </button>
        <span className="absolute bottom-4 text-xs font-medium text-gray-400">My Room</span>
      </div>

      <NavItem icon={<InboxIcon />} label="Inbox" isActive={activeView === 'notifications'} onClick={() => setActiveView('notifications')} />
      <NavItem icon={<ProfileIcon />} label="Me" isActive={activeView === 'profile'} onClick={() => setActiveView('profile')} />
    </nav>
  );
};

export default BottomNav;
