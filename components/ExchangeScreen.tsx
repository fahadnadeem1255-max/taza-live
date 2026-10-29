import React, { useState } from 'react';
import type { User } from '../types';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const PointCoinIcon = () => (
    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    </div>
);

interface ExchangeOption {
    points: number;
    coins: number;
}

const exchangeOptions: ExchangeOption[] = [
    { points: 10000, coins: 9300 },
    { points: 50000, coins: 46500 },
    { points: 100000, coins: 93000 },
    { points: 200000, coins: 186000 },
    { points: 500000, coins: 465000 },
    { points: 1000000, coins: 930000 },
    { points: 2000000, coins: 1860000 },
    { points: 10000000, coins: 9300000 },
];

interface ExchangeScreenProps {
    onBack: () => void;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    showToast: (message: string) => void;
}

const ExchangeScreen: React.FC<ExchangeScreenProps> = ({ onBack, user, setUser, showToast }) => {
    const [selectedOption, setSelectedOption] = useState<ExchangeOption>(exchangeOptions[0]);
    const [activeTab, setActiveTab] = useState<'host' | 'agent'>('host');

    const handleConfirm = () => {
        if (user.points < selectedOption.points) {
            showToast("You don't have enough points for this exchange.");
            return;
        }
        setUser(prevUser => ({
            ...prevUser,
            points: prevUser.points - selectedOption.points,
            coins: prevUser.coins + selectedOption.coins,
        }));
        showToast(`Exchanged ${selectedOption.points.toLocaleString()} points for ${selectedOption.coins.toLocaleString()} coins!`);
        onBack();
    };

    return (
        <div className="h-screen w-full bg-gray-50 text-gray-800 flex flex-col font-sans">
             {/* Header */}
            <header className="relative p-4 bg-white shadow-sm flex-shrink-0">
                <div className="relative flex items-center justify-between h-8">
                    <button onClick={onBack} className="absolute left-0 p-2">
                        <BackIcon />
                    </button>
                    <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">Exchange</h1>
                    <button className="absolute right-0 px-4 py-1.5 text-sm bg-pink-100 text-pink-600 rounded-full font-semibold">
                        Bill
                    </button>
                </div>
                <div className="flex justify-center items-center mt-4 space-x-8">
                    <button 
                        onClick={() => setActiveTab('host')}
                        className={`py-2 text-sm font-semibold transition-colors ${activeTab === 'host' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-500'}`}
                    >
                        Host points
                    </button>
                    <button 
                        onClick={() => setActiveTab('agent')}
                        className={`py-2 text-sm font-semibold transition-colors ${activeTab === 'agent' ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-500'}`}
                    >
                        Coin agent points
                    </button>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-5">
                {/* Points Card */}
                <div className="rounded-2xl p-4 text-white bg-gradient-to-r from-pink-500 to-rose-400 shadow-lg">
                    <p className="text-sm opacity-90">Remained points</p>
                    <div className="flex items-center mt-2">
                        <PointCoinIcon />
                        <span className="text-4xl font-bold ml-3">{user.points.toLocaleString()}</span>
                    </div>
                </div>
                
                {/* Exchange Options */}
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-3">Please select the point level</p>
                    <div className="space-y-4">
                        {exchangeOptions.map((option, index) => (
                            <label key={index} className="flex items-center text-base">
                                <input
                                    type="radio"
                                    name="exchange-option"
                                    className="hidden peer"
                                    checked={selectedOption.points === option.points}
                                    onChange={() => setSelectedOption(option)}
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center peer-checked:border-cyan-500">
                                     <div className="w-3 h-3 bg-cyan-500 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                </div>
                                <span>{option.points.toLocaleString()} Points = {option.coins.toLocaleString()} Coins</span>
                            </label>
                        ))}
                    </div>
                </div>
            </main>
            
            {/* Confirm Button */}
            <footer className="p-4 bg-white border-t border-gray-200">
                <button
                    onClick={handleConfirm}
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-green-400 text-white font-bold rounded-full text-lg shadow-lg"
                >
                    Confirm
                </button>
            </footer>
        </div>
    );
};

export default ExchangeScreen;