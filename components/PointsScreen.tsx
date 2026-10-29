import React from 'react';
import type { User, View } from '../types';

interface PointsScreenProps {
  onBack: () => void;
  user: User; // User data for points
  onNavigate: (view: View) => void;
}

// Icons as components
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ExchangeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
);
const WithdrawIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H4a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
);
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);
// This coin icon is custom, based on the image
const PointCoinIcon = () => (
    <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    </div>
);


const PointsScreen: React.FC<PointsScreenProps> = ({ onBack, user, onNavigate }) => {
    // Hardcoded data from the screenshot for visual replication
    const hostPoints = 10435;
    const coinAgentPoints = 86116;
    const incomeSummary = 8674;
    const giftIncome = 7174;
    const officialReward = 0;
    const othersIncome = 1500;
    const expensesSummary = 0;
    const withdrawExpense = 0;
    const exchangeExpense = 0;

  return (
    <div className="h-screen w-full bg-gray-50 text-gray-800 flex flex-col font-sans">
      {/* Header */}
      <header className="relative flex items-center justify-between p-4 bg-white shadow-sm flex-shrink-0">
        <button onClick={onBack} className="p-2">
          <BackIcon />
        </button>
        <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">Points</h1>
        <button className="px-4 py-1.5 text-sm bg-pink-100 text-pink-600 rounded-full font-semibold">
          Bill
        </button>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* Points Summary */}
        <div className="rounded-2xl p-4 text-white bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 shadow-lg">
          <div className="flex items-center">
            <div className="w-1/2 pr-2">
              <p className="text-sm opacity-90">Host points</p>
              <div className="flex items-center mt-2">
                <PointCoinIcon />
                <span className="text-3xl font-bold ml-2">{hostPoints.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-1/2 pl-2 border-l border-white/30 border-dashed">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90">Coin agent points</p>
                        <div className="flex items-center mt-2">
                            <PointCoinIcon />
                            <span className="text-3xl font-bold ml-2">{coinAgentPoints.toLocaleString()}</span>
                        </div>
                    </div>
                    <ChevronRightIcon />
                </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => onNavigate('exchange')} className="flex items-center justify-center py-2.5 bg-white border border-cyan-300 text-cyan-500 rounded-full shadow-sm font-semibold">
                <ExchangeIcon/> Exchange
            </button>
             <button onClick={() => onNavigate('withdraw')} className="flex items-center justify-center py-2.5 bg-white border border-amber-400 text-amber-500 rounded-full shadow-sm font-semibold">
                <WithdrawIcon/> Withdraw
            </button>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center text-sm text-gray-600 py-2">
            <CalendarIcon />
            <span className="ml-2 font-medium">Today</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-pink-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </div>

        {/* Income Section */}
        <div className="bg-pink-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Income</h2>
                <p className="text-sm">Summary: <span className="font-bold text-red-500">{incomeSummary.toLocaleString()}</span></p>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <span>Gift income</span>
                    <div className="flex items-center space-x-2">
                        <PointCoinIcon />
                        <span className="font-semibold">{giftIncome.toLocaleString()}</span>
                        <ChevronRightIcon />
                    </div>
                </div>
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <span>Official reward</span>
                    <div className="flex items-center space-x-2">
                        <PointCoinIcon />
                        <span className="font-semibold">{officialReward.toLocaleString()}</span>
                        <ChevronRightIcon />
                    </div>
                </div>
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <span>Others</span>
                    <div className="flex items-center space-x-2">
                        <PointCoinIcon />
                        <span className="font-semibold">{othersIncome.toLocaleString()}</span>
                        <ChevronRightIcon />
                    </div>
                </div>
            </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold">Expenses</h2>
                <p className="text-sm">Summary: <span className="font-bold text-green-600">{expensesSummary.toLocaleString()}</span></p>
            </div>
            <div className="space-y-2">
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <span>Withdraw</span>
                    <div className="flex items-center space-x-2">
                        <PointCoinIcon />
                        <span className="font-semibold">{withdrawExpense.toLocaleString()}</span>
                        <ChevronRightIcon />
                    </div>
                </div>
                 <div className="flex justify-between items-center bg-white p-3 rounded-xl">
                    <span>Exchange</span>
                    <div className="flex items-center space-x-2">
                        <PointCoinIcon />
                        <span className="font-semibold">{exchangeExpense.toLocaleString()}</span>
                        <ChevronRightIcon />
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default PointsScreen;