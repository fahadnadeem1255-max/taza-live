import React from 'react';

const games = [
    { id: 'wheel', name: 'Lucky Wheel', icon: '🎡', description: 'Spin to win amazing prizes!' },
    { id: 'treasure', name: 'Treasure Hunt', icon: '💎', description: 'Find hidden gems in rooms.' },
    { id: 'cards', name: 'Lucky Cards', icon: '🃏', description: 'Pick a card, any card!' },
];

const GameListScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="p-4 h-screen flex flex-col text-white">
            <header className="relative flex items-center justify-center mb-6 h-12">
                <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-bold text-purple-400">Game Center</h1>
            </header>
            <div className="flex-grow overflow-y-auto space-y-4">
                {games.map(game => (
                    <div key={game.id} className="p-4 rounded-lg bg-black/50 border border-purple-800 flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-4xl mr-4">{game.icon}</span>
                            <div>
                                <h3 className="font-bold text-lg text-white">{game.name}</h3>
                                <p className="text-sm text-gray-400">{game.description}</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 rounded-full font-bold text-sm bg-purple-600 text-white">
                            Play
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameListScreen;