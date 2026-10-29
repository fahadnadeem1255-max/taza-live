import React from 'react';

// Mock data for live records
const mockLiveRecords = [
  { id: 1, title: 'Chill Vibes & Lo-fi Beats', date: '2024-07-28', duration: '2h 15m', viewers: 1280, gifts: 56 },
  { id: 2, title: 'Gaming Marathon!', date: '2024-07-26', duration: '4h 30m', viewers: 2400, gifts: 123 },
  { id: 3, title: 'My First Stream', date: '2024-07-22', duration: '0h 45m', viewers: 350, gifts: 12 },
];

const LiveRecordScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Live Record</h1>
      </header>
      <div className="flex-grow overflow-y-auto space-y-3">
        {mockLiveRecords.length > 0 ? mockLiveRecords.map(record => (
          <div key={record.id} className="p-4 rounded-lg bg-black/50 border border-purple-800">
            <h3 className="font-bold text-white">{record.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{record.date} &bull; {record.duration}</p>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-300">
              <span>👀 {record.viewers.toLocaleString()} viewers</span>
              <span>🎁 {record.gifts.toLocaleString()} gifts</span>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 pt-20">
            <p>No past live records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveRecordScreen;