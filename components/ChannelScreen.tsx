import React, { useState } from 'react';

// Icons
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

const channels = [
    {
        id: 'easypaisa',
        name: 'easypaisa',
        logo: 'https://raw.githubusercontent.com/s_a_m_a/e-payment-logo/master/easypaisa.png',
        fee: '5%',
        arrival: '24 hours'
    },
    {
        id: 'jazzcash',
        name: 'Jazzcash',
        logo: 'https://raw.githubusercontent.com/s_a_m_a/e-payment-logo/master/jazzcash.png',
        fee: '5%',
        arrival: '24 hours'
    },
    {
        id: 'bank',
        name: 'Bank transfer',
        logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJoLTYgdy02IiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSI+CiAgPHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMjEgMTJsLTIuMjQyIDEuMTIyTDE0IDIxdC01LjAxLTYuMzc0TDQgMTJoMSA5aDEybDEtOVoiLz4KICA8cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xMiAxM2ExIDEgMCAxMDEtMiAxIDEgMCAwMTAgMnpNMTAgMy4yNUwyIDdoOHYtMy43NU0xNCAzLjI1TDIyIDdoLTh2LTMuNzVNNCAyMWgxNCIvPgogIDxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTYgN2gxMm0wIDBsNSA1bS01LTUgNS01Ii8+Cjwvc3ZnPg==',
        fee: '3%',
        arrival: '24 hours'
    }
];

interface ChannelScreenProps {
    onBack: () => void;
}

const ChannelScreen: React.FC<ChannelScreenProps> = ({ onBack }) => {
    const [isSellerVisible, setIsSellerVisible] = useState(true);

    return (
        <div className="h-screen w-full bg-gray-100 text-gray-800 flex flex-col font-sans">
            {/* Header */}
            <header className="relative flex items-center justify-center p-4 bg-white shadow-sm flex-shrink-0">
                <button onClick={onBack} className="absolute left-4 p-2">
                    <BackIcon />
                </button>
                <h1 className="text-lg font-semibold">Channel</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Country Selector */}
                <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
                    <span className="font-medium">Country</span>
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">Pakistan</span>
                        <span className="text-2xl">🇵🇰</span>
                        <ChevronRightIcon />
                    </div>
                </div>

                {/* Channel List */}
                <div className="space-y-3">
                    {channels.map(channel => (
                        <div key={channel.id} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
                            <div className="flex items-center">
                                <div className="w-12 h-12 flex items-center justify-center mr-3">
                                  <img src={channel.logo} alt={channel.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div>
                                    <p className="font-semibold text-base">{channel.name}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-md">Fee:{channel.fee}</span>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">Arrival: {channel.arrival}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="px-5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full shadow-md">
                                Bind
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Coin Seller Floating Widget */}
            {isSellerVisible && (
                 <div className="fixed bottom-16 right-4 flex items-center gap-2 animate-fade-in z-20">
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
        </div>
    );
};

export default ChannelScreen;