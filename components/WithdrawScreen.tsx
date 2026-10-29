import React, { useState } from 'react';
import type { User, View } from '../types';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);
const PointCoinIcon = () => (
    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    </div>
);

interface WithdrawOption {
    points: number;
    usd: number;
}

const withdrawalOptions: WithdrawOption[] = [
    { points: 120000, usd: 10 },
    { points: 480000, usd: 40 },
    { points: 1200000, usd: 100 },
    { points: 6000000, usd: 500 },
    { points: 12000000, usd: 1000 },
    { points: 24000000, usd: 2000 },
];

interface WithdrawScreenProps {
    onBack: () => void;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    showToast: (message: string) => void;
    onNavigate: (view: View) => void;
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ onBack, user, setUser, showToast, onNavigate }) => {
    const [selectedOption, setSelectedOption] = useState<WithdrawOption>(withdrawalOptions[0]);
    const [isSellerVisible, setIsSellerVisible] = useState(true);

    const handleConfirm = () => {
        if (user.points < selectedOption.points) {
            showToast("You don't have enough points for this withdrawal.");
            return;
        }
        setUser(prevUser => ({
            ...prevUser,
            points: prevUser.points - selectedOption.points
        }));
        showToast(`Withdrawal of ${selectedOption.points.toLocaleString()} points for $${selectedOption.usd} confirmed!`);
        onBack();
    };

    return (
        <div className="h-screen w-full bg-gray-50 text-gray-800 flex flex-col font-sans relative">
             {/* Header */}
            <header className="relative flex items-center justify-between p-4 bg-white shadow-sm flex-shrink-0">
                <button onClick={onBack} className="p-2">
                    <BackIcon />
                </button>
                <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">Withdraw</h1>
                <button className="px-4 py-1.5 text-sm bg-pink-100 text-pink-600 rounded-full font-semibold">
                    Bill
                </button>
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

                {/* Payment Method */}
                <button onClick={() => onNavigate('channel')} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm w-full text-left">
                    <div className="flex items-center">
                        <img src="https://raw.githubusercontent.com/s_a_m_a/e-payment-logo/master/easypaisa.png" alt="easypaisa" className="w-10 h-10 object-contain" />
                        <span className="ml-3 font-semibold">easypaisa</span>
                    </div>
                    <ChevronRightIcon />
                </button>
                
                {/* Exchange Rate & Options */}
                <div>
                    <p className="text-sm text-gray-500 font-semibold mb-3">Exchange rate: $1=PKR278.0</p>
                    <div className="space-y-4">
                        {withdrawalOptions.map((option, index) => (
                            <label key={index} className="flex items-center text-base">
                                <input
                                    type="radio"
                                    name="withdraw-option"
                                    className="hidden peer"
                                    checked={selectedOption.points === option.points}
                                    onChange={() => setSelectedOption(option)}
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center peer-checked:border-cyan-500 peer-checked:bg-cyan-500 transition-colors">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span>{option.points.toLocaleString()} Points = USD {option.usd}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </main>
            
            {/* Coin Seller Floating Widget */}
            {isSellerVisible && (
                 <div className="fixed bottom-28 right-4 flex items-center gap-2 animate-fade-in">
                    <div className="bg-white p-2 rounded-lg shadow-lg flex items-center gap-2">
                        <img src="https://i.ibb.co/P9M1s1x/profile-pic.jpg" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="text-xs font-bold">COIN SELLER</p>
                            <p className="text-xs text-gray-500">Contact</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSellerVisible(false)} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">✕</button>
                 </div>
            )}


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

export default WithdrawScreen;