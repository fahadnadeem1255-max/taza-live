import React, { useEffect, useState } from 'react';

interface Game {
    name: string;
    iconUrl: string;
    tag?: 'Hot' | 'New';
    tagColor?: string;
}

// Sourced game icons to match the screenshot
const games: Game[] = [
    { name: 'Airdrop', iconUrl: 'https://i.ibb.co/L8d5B2J/game-airdrop.png' },
    { name: 'Roulette', iconUrl: 'https://i.ibb.co/689X1kM/game-roulette.png', tag: 'Hot', tagColor: 'bg-red-500' },
    { name: 'Lineslots', iconUrl: 'https://i.ibb.co/R4m2XgW/game-lineslots.png', tag: 'Hot', tagColor: 'bg-red-500' },
    { name: 'Ocean Hunt', iconUrl: 'https://i.ibb.co/RHYySkH/game-oceanhunt.png', tag: 'Hot', tagColor: 'bg-red-500' },
    { name: 'Yummy Slots', iconUrl: 'https://i.ibb.co/K2nJ5QJ/game-yummy-slots.png', tag: 'New', tagColor: 'bg-green-500' },
    { name: 'Maze', iconUrl: 'https://i.ibb.co/vVRvH1H/game-maze.png' },
    { name: 'Greedy', iconUrl: 'https://i.ibb.co/Wc2kS3Y/game-greedy.png' },
    { name: 'BIG wheel', iconUrl: 'https://i.ibb.co/hR4yVzV/game-bigwheel.png' },
    { name: 'Teen Patti', iconUrl: 'https://i.ibb.co/tZp2hB6/game-teenpatti.png', tag: 'Hot', tagColor: 'bg-red-500' },
    { name: 'Magic Dice', iconUrl: 'https://i.ibb.co/gV2s8bX/game-magicdice.png' },
    { name: 'Fishing', iconUrl: 'https://i.ibb.co/JqfC4P1/game-fishing.png' },
    { name: 'Ferris Wheel', iconUrl: 'https://i.ibb.co/r2YJtP2/game-ferriswheel.png' },
    { name: 'Fruit Loops', iconUrl: 'https://i.ibb.co/9G3Z63m/game-fruitloops.png' },
    { name: 'Royal Poker', iconUrl: 'https://i.ibb.co/zZJg9Gq/game-royal-poker.png' },
    { name: 'Fruit Bar', iconUrl: 'https://i.ibb.co/6y4t3kH/game-fruit-bar.png' },
    { name: 'Lucky Number', iconUrl: 'https://i.ibb.co/RcjYdG0/game-lucky-number.png' },
    { name: 'Lucky Bags', iconUrl: 'https://i.ibb.co/Z12h8gW/game-lucky-bags.png' }
];

interface GameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GameItem: React.FC<{ game: Game }> = ({ game }) => (
    <div className="flex flex-col items-center text-center cursor-pointer">
        <div className="relative">
            <img src={game.iconUrl} alt={game.name} className="w-16 h-16 rounded-2xl shadow-md" />
            {game.tag && (
                <div className={`absolute -top-1 -right-2 text-xs text-white ${game.tagColor} px-1.5 py-0.5 rounded-full font-bold transform -rotate-12 shadow-lg`}>
                    {game.tag}
                </div>
            )}
        </div>
        <span className="text-xs text-gray-800 mt-2 font-medium">{game.name}</span>
    </div>
);

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose }) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        }
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    if (!isRendered) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTransitionEnd={handleAnimationEnd}
        >
            <div 
                className={`bg-white w-full max-w-lg rounded-t-2xl p-4 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Game</h2>
                <div className="grid grid-cols-4 gap-y-6 gap-x-4">
                    {games.map(game => (
                        <GameItem key={game.name} game={game} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameModal;
