import React from 'react';
import type { User } from '../types';

interface InviteScreenProps {
  onBack: () => void;
  user: User;
  showToast: (message: string) => void;
}

const InviteScreen: React.FC<InviteScreenProps> = ({ onBack, user, showToast }) => {

  const handleCopyCode = () => {
    if (user.inviteCode) {
        navigator.clipboard.writeText(user.inviteCode);
        showToast('Invitation code copied!');
    }
  };

  const handleShare = () => {
    showToast('Share functionality coming soon!');
    // In a real app, you might use navigator.share if available
  };

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Invite Friends</h1>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="bg-black/50 border border-purple-800 p-8 rounded-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-2">Invite friends, earn rewards!</h2>
          <p className="text-gray-400 mb-6">Share your code with friends. You both get rewards when they sign up.</p>
          
          <p className="text-sm text-gray-400">Your Invitation Code</p>
          <div className="my-2 p-4 border-2 border-dashed border-purple-500 rounded-lg">
            <p className="text-3xl font-bold tracking-widest text-purple-400">{user.inviteCode || 'N/A'}</p>
          </div>
          
          <button onClick={handleCopyCode} className="w-full mt-4 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors">
            Copy Code
          </button>
           <button onClick={handleShare} className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteScreen;