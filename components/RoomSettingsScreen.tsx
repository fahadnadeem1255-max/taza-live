import React, { useState, useEffect } from 'react';
import type { View, Room } from '../types';

interface RoomSettingsScreenProps {
  room: Room | null;
  onBack: () => void;
  showToast: (message: string) => void;
  onNavigate: (view: View) => void;
  onUpdateSettings: (settings: Partial<Room>) => void;
}

// Helper component for a consistent settings row
const SettingsRow: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
  <div className="w-full p-4 bg-black/50 border border-purple-800 rounded-lg flex justify-between items-center">
    <span>{label}</span>
    {children}
  </div>
);

// Reusable toggle switch component
const ToggleSwitch: React.FC<{ isEnabled: boolean; onToggle: () => void; }> = ({ isEnabled, onToggle }) => (
    <button onClick={onToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-purple-600' : 'bg-gray-600'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const RoomSettingsScreen: React.FC<RoomSettingsScreenProps> = ({ room, onBack, showToast, onNavigate, onUpdateSettings }) => {

  // State for all the settings, initialized from the room prop
  const [roomName, setRoomName] = useState(room?.title || "My Room");
  const [theme, setTheme] = useState(room?.theme || "Starry Night");
  const [mood, setMood] = useState(room?.mood || "Chill");
  const [seatCapacity, setSeatCapacity] = useState<5 | 10 | 20 | 40>(room?.seatCapacity || 20);
  const [mode, setMode] = useState<Room['mode']>(room?.mode || "Public");
  const [password, setPassword] = useState(room?.password || "");
  
  // These settings are not on the Room object yet, so they are local
  const [allowSmallGifts, setAllowSmallGifts] = useState(true);
  const [allowSpecialEffects, setAllowSpecialEffects] = useState(true);
  const [isChatZoneOpen, setIsChatZoneOpen] = useState(true);
  const [enableAnomalyDetection, setEnableAnomalyDetection] = useState(false);
  
  useEffect(() => {
    if (room) {
        setRoomName(room.title);
        setTheme(room.theme || 'Starry Night');
        setMood(room.mood || 'Chill');
        setSeatCapacity(room.seatCapacity || 20);
        setMode(room.mode || 'Public');
        setPassword(room.password || '');
    }
  }, [room]);
  
  const handleSave = () => {
    onUpdateSettings({
        title: roomName,
        theme,
        mood,
        seatCapacity,
        mode,
        password: mode === 'Password' ? password : undefined,
    });
    showToast("Settings saved successfully!");
  };

  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Room Settings</h1>
        <button onClick={handleSave} className="absolute right-0 px-4 py-1.5 text-sm font-semibold bg-purple-600 rounded-full hover:bg-purple-700">
          Save
        </button>
      </header>
      <div className="flex-grow overflow-y-auto space-y-6">
        
        {/* Basic Settings */}
        <div>
            <h2 className="text-sm font-semibold text-purple-400 px-2 mb-2">Basic Settings</h2>
            <div className="space-y-2">
                <SettingsRow label="Room Name">
                    <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="bg-transparent text-right text-gray-400 focus:outline-none w-1/2" />
                </SettingsRow>
                 <SettingsRow label="Theme Option">
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-transparent text-right text-gray-400 focus:outline-none appearance-none">
                        <option>Starry Night</option>
                        <option>Classic</option>
                        <option>Neon Party</option>
                        <option>Colorful</option>
                        <option>💎 Premium Theme</option>
                    </select>
                </SettingsRow>
                <SettingsRow label="Room Mood">
                    <select value={mood} onChange={(e) => setMood(e.target.value)} className="bg-transparent text-right text-gray-400 focus:outline-none appearance-none">
                        <option>Chill</option>
                        <option>Party</option>
                        <option>Debate</option>
                        <option>Singing</option>
                    </select>
                </SettingsRow>
                <SettingsRow label="Seat Capacity">
                    <select value={seatCapacity} onChange={(e) => setSeatCapacity(Number(e.target.value) as 5 | 10 | 20 | 40)} className="bg-transparent text-right text-gray-400 focus:outline-none appearance-none">
                        <option value={5}>5 Seats</option>
                        <option value={10}>10 Seats</option>
                        <option value={20}>20 Seats</option>
                        <option value={40}>40 Seats</option>
                    </select>
                </SettingsRow>
                 <SettingsRow label="Room Mode Option">
                    <select value={mode} onChange={(e) => setMode(e.target.value as Room['mode'])} className="bg-transparent text-right text-gray-400 focus:outline-none appearance-none">
                        <option>Public</option>
                        <option>Password</option>
                        <option>Private</option>
                    </select>
                </SettingsRow>
                {mode === 'Password' && (
                  <SettingsRow label="Set Password">
                      <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter password" 
                        className="bg-transparent text-right text-gray-400 focus:outline-none w-1/2 placeholder-gray-600" 
                      />
                  </SettingsRow>
                )}
            </div>
        </div>

        {/* Gift & Interaction */}
        <div>
            <h2 className="text-sm font-semibold text-purple-400 px-2 mb-2">Gift & Interaction</h2>
            <div className="space-y-2">
                 <SettingsRow label="Small Gifts">
                    <ToggleSwitch isEnabled={allowSmallGifts} onToggle={() => setAllowSmallGifts(p => !p)} />
                </SettingsRow>
                <SettingsRow label="Special Effects">
                    <ToggleSwitch isEnabled={allowSpecialEffects} onToggle={() => setAllowSpecialEffects(p => !p)} />
                </SettingsRow>
                 <SettingsRow label="Open the chat zone button">
                    <ToggleSwitch isEnabled={isChatZoneOpen} onToggle={() => setIsChatZoneOpen(p => !p)} />
                </SettingsRow>
                 <SettingsRow label="Gift Record">
                     <button onClick={() => onNavigate('giftRecord')} className="text-gray-500 text-sm hover:text-white">&gt;</button>
                </SettingsRow>
            </div>
        </div>

        {/* Management */}
        <div>
            <h2 className="text-sm font-semibold text-purple-400 px-2 mb-2">Management</h2>
            <div className="space-y-2">
                 <SettingsRow label="Room Manager">
                     <button onClick={() => onNavigate('roomManager')} className="text-gray-500 text-sm hover:text-white">&gt;</button>
                </SettingsRow>
                <SettingsRow label="Block List">
                     <button onClick={() => onNavigate('blockList')} className="text-gray-500 text-sm hover:text-white">&gt;</button>
                </SettingsRow>
                 <SettingsRow label="Room Tips">
                     <button onClick={() => onNavigate('roomTips')} className="text-gray-500 text-sm hover:text-white">&gt;</button>
                </SettingsRow>
                 <SettingsRow label="Room anomaly user detection">
                    <ToggleSwitch isEnabled={enableAnomalyDetection} onToggle={() => setEnableAnomalyDetection(p => !p)} />
                </SettingsRow>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RoomSettingsScreen;