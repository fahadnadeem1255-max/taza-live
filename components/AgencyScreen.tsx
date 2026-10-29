import React from 'react';

interface AgencyScreenProps {
  onBack: () => void;
}

const AgencyScreen: React.FC<AgencyScreenProps> = ({ onBack }) => {
  return (
    <div className="p-4 h-screen flex flex-col">
      <header className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">My Agency</h1>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-black/50 border border-purple-800 p-8 rounded-lg w-full max-w-sm">
          <h2 className="text-xl text-center font-semibold mb-6 text-purple-400">Join an Agency</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="agency-code" className="block text-sm font-medium text-gray-300 mb-2">Agency Code</label>
              <input type="text" id="agency-code" className="w-full bg-gray-800 border border-purple-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter agency code" />
            </div>
            <button type="submit" className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 rounded-lg">
              Join Agency
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgencyScreen;