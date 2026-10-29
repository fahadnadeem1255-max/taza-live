import React, { useRef } from 'react';
import type { User, RoomType } from '../types';

interface MyRoomSetupScreenProps {
  user: User;
  onStartStream: (title: string, type: RoomType, coverImage: string) => void;
  roomTitle: string;
  setRoomTitle: React.Dispatch<React.SetStateAction<string>>;
  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const MyRoomSetupScreen: React.FC<MyRoomSetupScreenProps> = ({ 
  user, 
  onStartStream,
  roomTitle,
  setRoomTitle,
  coverImage,
  setCoverImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStart = (type: RoomType) => {
    if (!roomTitle.trim() || !coverImage) {
      alert("Please set a room title and select a cover image.");
      return;
    }
    onStartStream(roomTitle, type, coverImage);
  };

  return (
    <div className="p-4 flex flex-col h-full text-white">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">Setup Your Room</h1>
      
      <div className="space-y-6 flex-grow">
        <div>
          <label htmlFor="room-title" className="block text-sm font-medium text-gray-300 mb-2">Room Title & Cover</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 flex-shrink-0 bg-black/50 border-2 border-dashed border-purple-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-500 overflow-hidden"
            >
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </button>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverImageChange}
              className="hidden"
              accept="image/*"
            />
            <input
              id="room-title"
              type="text"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="Enter your stream title..."
              className="w-full bg-black/50 border border-purple-800 rounded-lg px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-6 space-y-3">
         <button 
          onClick={() => handleStart('video')} 
          disabled={!roomTitle.trim() || !coverImage}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
          <span>Start Video Live</span>
        </button>
        <button 
          onClick={() => handleStart('audio')} 
          disabled={!roomTitle.trim() || !coverImage}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a1 1 0 000 2h1a1 1 0 000-2H5zM2 3a1 1 0 000 2h1a1 1 0 000-2H2zM8 3a1 1 0 000 2h1a1 1 0 000-2H8zM11 3a1 1 0 000 2h1a1 1 0 000-2h-1zM2 7a1 1 0 000 2h1a1 1 0 000-2H2zM5 7a1 1 0 000 2h1a1 1 0 000-2H5zM8 7a1 1 0 000 2h1a1 1 0 000-2H8zM11 7a1 1 0 000 2h1a1 1 0 000-2h-1zM2 11a1 1 0 000 2h1a1 1 0 000-2H2zM5 11a1 1 0 000 2h1a1 1 0 000-2H5zM8 11a1 1 0 000 2h1a1 1 0 000-2H8zM11 11a1 1 0 000 2h1a1 1 0 000-2h-1zM14 4a1 1 0 011 1v1a1 1 0 01-2 0V5a1 1 0 011-1zM3 15a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>
          <span>Start Audio Live</span>
        </button>
      </div>
    </div>
  );
};

export default MyRoomSetupScreen;