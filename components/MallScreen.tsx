import React from 'react';
import type { User } from '../types';
import { mallItems } from '../constants';

interface MallScreenProps {
  onBack: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const MallScreen: React.FC<MallScreenProps> = ({ onBack, user, setUser }) => {

    const handlePurchase = (item: typeof mallItems[0]) => {
        if (user.coins < item.cost) {
            alert("Not enough coins!");
            return;
        }

        const confirmPurchase = window.confirm(`Are you sure you want to buy ${item.name} for ${item.cost.toLocaleString()} coins?`);
        if (confirmPurchase) {
            setUser(prevUser => {
                const updatedUser = {
                    ...prevUser,
                    coins: prevUser.coins - item.cost,
                };

                if (item.type === 'frame') {
                    updatedUser.frameUrl = item.value;
                }
                
                // Logic for entry effects could be added here
                
                return updatedUser;
            });
            alert(`${item.name} purchased successfully!`);
        }
    };

    return (
        <div className="p-4 h-screen flex flex-col">
            <header className="flex items-center mb-6">
                <button onClick={onBack} className="mr-4 text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-white">Mall & Shopping</h1>
            </header>
            <div className="flex-grow overflow-y-auto space-y-4">
                <div className="bg-black/50 border border-purple-800 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-purple-400 mb-3">Frames & Entries</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {mallItems.map(item => (
                            <div key={item.id} className="bg-black/50 border border-purple-900 rounded-lg p-3 flex flex-col items-center text-center">
                                <div className="w-20 h-20 mb-2 flex items-center justify-center">
                                    <img src={item.preview} alt={item.name} className="max-w-full max-h-full" />
                                </div>
                                <p className="font-semibold text-sm">{item.name}</p>
                                <div className="flex items-center text-yellow-400 text-sm my-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    <span>{item.cost.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => handlePurchase(item)}
                                    className="w-full bg-purple-600 text-white font-bold py-1 px-3 rounded-full text-xs hover:bg-purple-700"
                                >
                                    Buy
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MallScreen;