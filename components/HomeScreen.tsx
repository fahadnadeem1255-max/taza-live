import React, { useState } from 'react';
import type { Room, RoomType } from '../types';
import { allCountriesForFilter } from '../constants';

interface RoomCardProps {
  room: Room;
  onJoin: (room: Room) => void;
  size?: 'large' | 'small';
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin, size = 'large' }) => {
  const Icon = () => room.type === 'video' 
    ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
    : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a1 1 0 000 2h1a1 1 0 000-2H5zM2 3a1 1 0 000 2h1a1 1 0 000-2H2zM8 3a1 1 0 000 2h1a1 1 0 000-2H8zM11 3a1 1 0 000 2h1a1 1 0 000-2h-1zM2 7a1 1 0 000 2h1a1 1 0 000-2H2zM5 7a1 1 0 000 2h1a1 1 0 000-2H5zM8 7a1 1 0 000 2h1a1 1 0 000-2H8zM11 7a1 1 0 000 2h1a1 1 0 000-2h-1zM2 11a1 1 0 000 2h1a1 1 0 000-2H2zM5 11a1 1 0 000 2h1a1 1 0 000-2H5zM8 11a1 1 0 000 2h1a1 1 0 000-2H8zM11 11a1 1 0 000 2h1a1 1 0 000-2h-1zM14 4a1 1 0 011 1v1a1 1 0 01-2 0V5a1 1 0 011-1zM3 15a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>;
    
  const isLarge = size === 'large';

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-black/50 border border-purple-900 cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => onJoin(room)}>
      <div className="relative">
        <img className={`w-full ${isLarge ? 'h-40' : 'h-28'} object-cover`} src={room.coverImage} alt={room.title} />
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs flex items-center gap-1">
          <Icon />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full px-2 py-1 text-xs flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
          <span>{room.viewers}</span>
        </div>
      </div>
      <div className={isLarge ? 'p-3' : 'p-2'}>
        <h3 className={`font-bold ${isLarge ? 'text-sm' : 'text-xs'} truncate text-white`}>{room.title}</h3>
        <div className="flex items-center mt-1">
          <img className={`rounded-full ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} src={room.host.avatar} alt={room.host.name} />
          <p className={`text-gray-400 ${isLarge ? 'text-xs' : 'text-[10px]'} ml-2 truncate`}>{room.host.name}</p>
        </div>
      </div>
    </div>
  );
}

interface HomeScreenProps {
  rooms: Room[];
  onJoinRoom: (room: Room) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ rooms, onJoinRoom }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [selectedCountry, setSelectedCountry] = useState({ name: 'Global', flag: '🌍' });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const handleCountrySelect = (country: { name: string; flag: string; }) => {
      setSelectedCountry(country);
      setIsCountryDropdownOpen(false);
  };

  const filteredRooms = rooms.filter(room => {
    const typeMatch = activeFilter === 'all' || room.type === activeFilter;
    const countryMatch = selectedCountry.name === 'Global' || room.country === selectedCountry.name;
    return typeMatch && countryMatch;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => b.viewers - a.viewers);
  const topRooms = sortedRooms.slice(0, 3);
  const otherRooms = sortedRooms.slice(3);

  return (
    <div className="p-4 h-full flex flex-col">
       {/* Top Header with Search and Country */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
         <div className="flex items-center justify-center p-1 bg-black/50 rounded-full border border-purple-800">
            {(['all', 'audio', 'video'] as const).map(type => (
                <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors ${
                        activeFilter === type ? 'bg-pink-600 text-white' : 'text-gray-400'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
        <div className="flex items-center gap-3">
            <button className="p-2 bg-black/50 rounded-full text-white" onClick={() => alert('Search coming soon!')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
             <div className="relative">
                <button onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className="flex items-center gap-2 bg-black/50 p-2 rounded-full text-white">
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                {isCountryDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-purple-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {allCountriesForFilter.map(country => (
                        <button key={country.name} onClick={() => handleCountrySelect(country)} className="w-full text-left p-2 hover:bg-purple-600 flex items-center gap-3 text-white">
                        <span className="text-xl">{country.flag}</span>
                        <span>{country.name}</span>
                        </button>
                    ))}
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Rooms grid */}
      <div className="flex-grow overflow-y-auto">
        {sortedRooms.length > 0 ? (
          <div className="space-y-6">
            {/* Top Rooms Section */}
            {topRooms.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-pink-400 mb-3">Top Rooms</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {topRooms.map(room => (
                          <RoomCard key={room.id} room={room} onJoin={onJoinRoom} size="large" />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Rooms Section */}
            {otherRooms.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-teal-400 mb-3">Explore</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {otherRooms.map(room => (
                          <RoomCard key={room.id} room={room} onJoin={onJoinRoom} size="small" />
                        ))}
                    </div>
                </div>
            )}
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center h-full">
              <p className="text-gray-500">No rooms found for {selectedCountry.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;