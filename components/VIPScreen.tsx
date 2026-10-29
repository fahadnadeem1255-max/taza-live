import React from 'react';

interface VIPScreenProps {
  onBack: () => void;
}

const vipLevels = [
  { name: 'S VIP', badgeColor: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-400/50' },
  { name: 'VIP 7', badgeColor: 'from-red-500 to-red-700', shadow: 'shadow-red-500/50' },
  { name: 'VIP 6', badgeColor: 'from-purple-500 to-purple-700', shadow: 'shadow-purple-500/50' },
  { name: 'VIP 5', badgeColor: 'from-indigo-500 to-indigo-700', shadow: 'shadow-indigo-500/50' },
  { name: 'VIP 4', badgeColor: 'from-blue-500 to-blue-700', shadow: 'shadow-blue-500/50' },
  { name: 'VIP 3', badgeColor: 'from-green-500 to-green-700', shadow: 'shadow-green-500/50' },
  { name: 'VIP 2', badgeColor: 'from-teal-500 to-teal-700', shadow: 'shadow-teal-500/50' },
  { name: 'VIP 1', badgeColor: 'from-gray-500 to-gray-700', shadow: 'shadow-gray-500/50' },
];

const VIPScreen: React.FC<VIPScreenProps> = ({ onBack }) => {
  return (
    <div className="p-4 h-screen flex flex-col">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">VIP Center</h1>
      </header>
      <div className="flex-grow overflow-y-auto space-y-4">
        {vipLevels.map((level) => (
          <div key={level.name} className={`p-4 rounded-lg bg-black/50 border border-purple-800 flex items-center justify-between shadow-lg ${level.shadow}`}>
            <span className={`px-4 py-1 text-lg font-bold text-white bg-gradient-to-r ${level.badgeColor} rounded-full`}>
              {level.name}
            </span>
            <span className="text-sm text-gray-400">Exclusive Privileges</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VIPScreen;