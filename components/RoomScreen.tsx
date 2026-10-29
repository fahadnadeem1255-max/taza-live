import React, { useState, useEffect, useRef } from 'react';
import type { Room, User, Gift, View } from '../types';
import { mockGifts, mockUser as fallbackOpponent } from '../constants';

// --- TYPE DEFINITIONS for this component ---
interface ChatMessage {
  user: User;
  text: string;
  type: 'user' | 'gift' | 'system';
  gift?: Gift;
}
interface FlyingEmoji {
  id: number;
  emoji: string;
  style: React.CSSProperties;
}


// --- SUB-COMPONENTS for the RoomScreen design ---

// --- Video Room Sub-Component ---
const VideoTile: React.FC<{ 
    participant: User; 
    isCurrentUser: boolean;
    brightness: number;
    saturation: number;
}> = ({ participant, isCurrentUser, brightness, saturation }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const videoStyle = {
        filter: `brightness(${brightness}%) saturate(${saturation}%)`
    };

    useEffect(() => {
        let isMounted = true;
        if (isCurrentUser) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(mediaStream => {
                    if (isMounted) {
                        streamRef.current = mediaStream;
                        if (videoRef.current) {
                            videoRef.current.srcObject = mediaStream;
                        }
                    } else {
                        mediaStream.getTracks().forEach(track => track.stop());
                    }
                })
                .catch(err => {
                    console.error("Error accessing media devices.", err);
                    if (isMounted) setError("Camera access denied. Please allow permissions.");
                });
        }

        return () => {
            isMounted = false;
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCurrentUser]);

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center">
            {isCurrentUser && !error ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={videoStyle} />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/30">
                     <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover opacity-50" />
                </div>
            )}
            {isCurrentUser && error && <p className="absolute text-center text-xs text-yellow-300 p-2">{error}</p>}
        </div>
    );
};

// --- Generic Action Panel ---
const ActionPanel: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0" onClick={e => e.stopPropagation()}>
        <div className="h-full p-4 bg-black/90 backdrop-blur-sm rounded-t-2xl border-t border-purple-800">
            <h3 className="text-lg font-bold text-center mb-4 text-pink-400">{title}</h3>
            {children}
        </div>
      </div>
    </div>
);

// --- NEW AUDIO ROOM SEAT COMPONENT (Adjusted for half-screen layout) ---
const AudioSeat: React.FC<{ seatNumber: number; participant: User | null; isHost: boolean }> = ({ seatNumber, participant, isHost }) => {
    // Smaller size for the half-screen grid
    return (
        <div className="relative w-16 h-16 flex flex-col items-center justify-center">
            {participant ? (
                <img 
                    src={participant.avatar} 
                    alt={participant.name} 
                    className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover" 
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border-2 border-dashed border-gray-700">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" /></svg>
                </div>
            )}
             {/* Seat Number Badge */}
            <div className="absolute bottom-2 -right-0 bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center border border-purple-800">
                <span className="text-purple-300 text-[9px] font-bold">{seatNumber}</span>
            </div>
            {isHost && (
                <div className="absolute top-2 -left-0 bg-yellow-400 text-black rounded-full p-1 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

// --- NEW EXIT MENU ---
const ExitMenu: React.FC<{ 
    onClose: () => void; 
    onConfirmLeave: () => void; 
    rooms: Room[];
    currentRoom: Room;
    onJoinRoom: (room: Room) => void;
    showToast: (message: string) => void;
}> = ({ onClose, onConfirmLeave, rooms, currentRoom, onJoinRoom, showToast }) => {
    
    const suggestedRooms = rooms.filter(r => r.id !== currentRoom.id).slice(0, 3);
    
    const handleJoin = (room: Room) => {
        onClose();
        onJoinRoom(room);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Join my live stream!',
            text: `Check out this room: ${currentRoom.title}`,
            url: window.location.href, // In a real app, this would be a direct link to the room
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support the Web Share API
                navigator.clipboard.writeText(shareData.url);
                showToast('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Share error:', err);
            showToast('Could not share at this time.');
        } finally {
            onClose();
        }
    };

    const handleMinimize = () => {
        showToast('Room minimized.');
        onClose();
    };

    const handleReport = () => {
        showToast('Room reported. Thank you.');
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end" onClick={onClose}>
            <div className="bg-gray-900 border-t-2 border-purple-800 p-4 rounded-t-2xl" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <button onClick={handleMinimize} className="flex flex-col items-center gap-2 text-gray-300"><div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-2xl">🔄</div><span className="text-xs">Minimize</span></button>
                    <button onClick={handleShare} className="flex flex-col items-center gap-2 text-gray-300"><div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-2xl">🔗</div><span className="text-xs">Share</span></button>
                    <button onClick={handleReport} className="flex flex-col items-center gap-2 text-gray-300"><div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-2xl">🚩</div><span className="text-xs">Report</span></button>
                </div>

                {suggestedRooms.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Other Rooms</h3>
                        <div className="space-y-2">
                             {suggestedRooms.map(room => (
                                <div key={room.id} onClick={() => handleJoin(room)} className="flex items-center p-2 bg-black/50 rounded-lg cursor-pointer">
                                    <img src={room.coverImage} className="w-10 h-10 rounded-md object-cover"/>
                                    <div className="ml-3">
                                        <p className="text-sm font-bold truncate">{room.title}</p>
                                        <p className="text-xs text-gray-400">{room.host.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col gap-2">
                    <button onClick={onConfirmLeave} className="w-full py-3 bg-red-600/80 text-white font-bold rounded-lg">Leave Room</button>
                    <button onClick={onClose} className="w-full py-3 bg-gray-700 text-white font-bold rounded-lg">Cancel</button>
                </div>
            </div>
        </div>
    );
};

// --- NEW UNIFIED HEADER ---
const UnifiedRoomHeader: React.FC<{
    room: Room;
    onViewProfile: (user: User) => void;
    onClose: () => void;
    isHost: boolean;
    isFollowing: boolean;
    onFollow: () => void;
}> = ({ room, onViewProfile, onClose, isHost, isFollowing, onFollow }) => {
    return (
        <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-20 bg-gradient-to-b from-black/50 to-transparent">
            {/* Left side: Host Info & Follow button */}
            <div className="flex items-center gap-2">
                <div onClick={() => onViewProfile(room.host)} className="flex items-center gap-2 p-1 pr-3 bg-black/50 rounded-full cursor-pointer">
                    <img src={room.host.avatar} alt={room.host.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-bold text-sm">{room.host.name}</p>
                        <p className="text-xs text-gray-400">ID: {room.host.idNumber}</p>
                    </div>
                </div>
                {!isHost && (
                    <button 
                        onClick={onFollow}
                        className={`px-3 py-1 text-xs font-bold rounded-full ${isFollowing ? 'bg-gray-700 text-gray-300' : 'bg-pink-600 text-white'}`}
                    >
                        {isFollowing ? 'Following' : '+ Follow'}
                    </button>
                )}
            </div>

            {/* Right side: Viewers and Close button */}
            <div className="flex items-center gap-2">
                <div className="p-1.5 px-3 bg-black/50 rounded-full flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    <span className="text-xs text-white">{room.viewers}</span>
                </div>
                <button onClick={onClose} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};


interface RoomScreenProps {
  room: Room;
  rooms: Room[]; // For suggestions
  user: User; 
  setUser: React.Dispatch<React.SetStateAction<User>>; 
  onLeave: () => void; 
  onStopStream: () => void; 
  onViewProfile: (user: User) => void; 
  onNavigate: (view: View) => void; 
  showToast: (message: string) => void;
  onJoinRoom: (room: Room) => void;
  onOpenGameModal: () => void;
}

const RoomScreen: React.FC<RoomScreenProps> = ({ room, rooms, user, setUser, onLeave, onStopStream, onViewProfile, onNavigate, showToast, onJoinRoom, onOpenGameModal }) => {
  const [currentRoomData, setCurrentRoomData] = useState<Room>(room);
  const [messages, setMessages] = useState<ChatMessage[]>([{user: user, text: 'Welcome! Please be respectful and follow community guidelines.', type: 'system'}]);
  
  const [isGiftPanelOpen, setIsGiftPanelOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [isPkPanelOpen, setIsPkPanelOpen] = useState(false);
  const [isExitMenuOpen, setIsExitMenuOpen] = useState(false);
  
  const [isSelfMuted, setIsSelfMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [chatInputValue, setChatInputValue] = useState("");
  const [flyingEmojis, setFlyingEmojis] = useState<FlyingEmoji[]>([]);
  const [roomGiftsValue, setRoomGiftsValue] = useState(190634);

  const [isFollowing, setIsFollowing] = useState(false);

  const [isBeautyPanelOpen, setIsBeautyPanelOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const [pkState, setPkState] = useState<{isActive: boolean; timer: number; myScore: number; opponentScore: number; opponent: User | null; result: 'win' | 'lose' | 'draw' | null;}>({ isActive: false, timer: 300, myScore: 0, opponentScore: 0, opponent: null, result: null, });
  
  const isHost = user.id === currentRoomData.host.id;
  
  const addMessage = (msg: ChatMessage) => { setMessages(prev => [...prev, msg].slice(-50)); };

  const handleSendChatMessage = () => {
    if (chatInputValue.trim() !== "") {
        addMessage({ user, text: chatInputValue, type: 'user' });
        setChatInputValue("");
    }
  };
  
  const handleSendGift = (gift: Gift) => {
    if (user.coins >= gift.cost) {
      setUser(prev => ({ ...prev, coins: prev.coins - gift.cost }));
      addMessage({ user, text: `sent a ${gift.name}`, type: 'gift', gift: gift });
      setRoomGiftsValue(prev => prev + gift.cost);
      if (pkState.isActive) { setPkState(prev => ({ ...prev, myScore: prev.myScore + gift.cost })); }
    } else { showToast("Not enough coins!"); }
  };

  const handleFollow = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);

    // Update the local room data to reflect the change in fan count
    setCurrentRoomData(prevRoom => {
        if (!prevRoom) return prevRoom;
        const newFans = newFollowingState ? prevRoom.host.fans + 1 : prevRoom.host.fans - 1;
        
        // This ensures that when onViewProfile is called, it passes the updated user object
        const updatedHost = { ...prevRoom.host, fans: newFans };
        
        // Also update the main user object if the host is the user being viewed
        // In a real app, this would be a global state update.
        // For now, we pass the updated host to onViewProfile.
        onViewProfile(updatedHost); // This is a bit of a hack to update the state upstream for the profile view
        
        return {
            ...prevRoom,
            host: updatedHost,
        };
    });

    showToast(newFollowingState ? `Followed ${room.host.name}!` : `Unfollowed ${room.host.name}.`);
  };
  
  const handleAllInGift = () => {
    if (!pkState.isActive) return;
    const allInAmount = Math.floor(user.coins * 0.8);
    if (allInAmount < 1) { showToast("Not enough coins for an All-In!"); return; }
    setUser(prev => ({ ...prev, coins: prev.coins - allInAmount }));
    addMessage({ user, text: `went ALL IN with ${allInAmount.toLocaleString()} coins!`, type: 'system' });
    setPkState(prev => ({ ...prev, myScore: prev.myScore + allInAmount }));
  };

  useEffect(() => {
    if (!pkState.isActive) return;
    const timerInterval = setInterval(() => {
      setPkState(prev => {
        if (prev.timer <= 1) {
          clearInterval(timerInterval);
          const result = prev.myScore > prev.opponentScore ? 'win' : prev.myScore < prev.opponentScore ? 'lose' : 'draw';
          return { ...prev, isActive: false, timer: 0, result: result };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [pkState.isActive, pkState.myScore, pkState.opponentScore]);

  const handleEmojiClick = (emoji: string) => {
    const newEmoji: FlyingEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      style: {
        left: `${Math.random() * 80 + 10}%`,
        animationDuration: `${Math.random() * 2 + 3}s`,
      },
    };
    setFlyingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFlyingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 5000); // Corresponds to animation duration
  };
  
    const handleShare = async () => {
        const shareData = { title: 'Join my live stream!', text: `Check out this room: ${currentRoomData.title}`, url: window.location.href };
        try {
            if (navigator.share) await navigator.share(shareData);
            else {
                navigator.clipboard.writeText(shareData.url);
                showToast('Link copied to clipboard!');
            }
        } catch (err) { showToast('Could not share at this time.'); }
    };
    
      const moreOptionsItems = [
        { label: 'Room settings', icon: '⚙️', action: () => onNavigate('roomSettings'), hostOnly: true },
        { label: 'Reward', icon: '🏆', action: () => showToast('Reward center coming soon!') },
        { label: 'Announcement', icon: '📢', action: () => showToast('Announcement feature coming soon!'), hostOnly: true },
        { label: 'Private chat', icon: '💬', action: () => showToast('Private chat coming soon!') },
        { label: 'Play music', icon: '🎵', action: () => showToast('Music feature coming soon!') },
        { label: 'Share', icon: '🔗', action: handleShare },
        { label: 'Feedback', icon: '📝', action: () => onNavigate('feedback') },
        { label: 'Send picture', icon: '🖼️', action: () => showToast('Send picture coming soon!') },
        { label: 'Clear point', icon: '🧹', action: () => showToast('Points cleared! (demo)') },
        { label: 'PK Battle', icon: '⚔️', action: () => setIsPkPanelOpen(true) },
    ];


  const renderVideoRoom = () => (
    <>
      <div className="absolute inset-0 w-full h-full pt-20"> {/* Add padding for new header */}
        <VideoTile participant={currentRoomData.host} isCurrentUser={isHost} brightness={brightness} saturation={saturation} />
      </div>

      <div className="absolute bottom-24 left-4 w-2/3 h-1/4 z-10 flex flex-col space-y-1 overflow-y-auto pointer-events-none">
        {messages.map((msg, index) => (
          <div key={index} className="bg-black/40 p-1.5 rounded-lg text-xs w-fit max-w-full">
            <span className={msg.type === 'system' ? 'text-yellow-400' : 'text-purple-300 font-bold'}>{msg.user.name}: </span>
            <span className="text-white">{msg.text}</span>
            {msg.gift && <span className="ml-1">{msg.gift.icon}</span>}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
            <input type="text" placeholder="Say something..." value={chatInputValue} onChange={(e) => setChatInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()} className="bg-black/50 border border-purple-800 rounded-full px-4 py-2 text-sm text-white w-32 md:w-48" />
            <button onClick={() => setIsGiftPanelOpen(true)} className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg">🎁</button>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={onOpenGameModal} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-2xl">🎮</button>
            <button onClick={() => setIsMoreOptionsOpen(true)} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-2xl">•••</button>
        </div>
      </div>
    </>
  );

  const renderAudioRoom = () => (
    <div className="flex flex-col h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${currentRoomData.coverImage})` }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
        <div className="relative z-10 flex flex-col h-full pt-16">
            <div className="flex-grow h-1/2 p-2 grid grid-cols-5 gap-x-2 gap-y-1 content-center justify-items-center">
                 {Array.from({ length: 20 }).map((_, i) => {
                    const participant = currentRoomData.participants[i];
                    return <AudioSeat key={i} seatNumber={i + 1} participant={participant} isHost={participant?.id === currentRoomData.host.id} />
                })}
            </div>

             <div className="flex-grow h-1/2 flex flex-col-reverse p-4 overflow-hidden">
                <div className="space-y-2 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className="bg-black/40 p-1.5 rounded-lg text-xs w-fit max-w-full">
                            <span className={msg.type === 'system' ? 'text-yellow-400' : 'text-purple-300 font-bold'}>{msg.user.name}: </span>
                            <span className="text-white">{msg.text}</span>
                            {msg.gift && <span className="ml-1">{msg.gift.icon}</span>}
                        </div>
                    ))}
                </div>
            </div>

             <div className="flex-shrink-0 p-3 flex items-center justify-between gap-2 bg-black/30">
                <input type="text" placeholder="Comment..." value={chatInputValue} onChange={(e) => setChatInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()} className="bg-black/50 border border-purple-800 rounded-full px-3 py-2 text-xs text-gray-400 w-24" />
                <div className="flex items-center gap-1.5">
                    <button onClick={() => setIsSelfMuted(p => !p)} className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-xl">{isSelfMuted ? '🔇' : '🎤'}</button>
                    <button onClick={() => setIsSpeakerOn(p => !p)} className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-xl">{isSpeakerOn ? '🔊' : '🔈'}</button>
                    <button onClick={() => setIsGiftPanelOpen(true)} className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-xl">🎁</button>
                    <button onClick={onOpenGameModal} className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-xl">🎮</button>
                    <button onClick={() => handleEmojiClick('💖')} className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-xl">💖</button>
                    <button onClick={() => setIsMoreOptionsOpen(true)} className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-xl">•••</button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-gray-800 overflow-hidden text-white">
      
      {currentRoomData.type === 'video' ? renderVideoRoom() : renderAudioRoom()}

      <UnifiedRoomHeader
          room={currentRoomData}
          onViewProfile={onViewProfile}
          onClose={() => setIsExitMenuOpen(true)}
          isHost={isHost}
          isFollowing={isFollowing}
          onFollow={handleFollow}
      />
      
      {isExitMenuOpen && (
        <ExitMenu 
            onClose={() => setIsExitMenuOpen(false)}
            onConfirmLeave={isHost ? onStopStream : onLeave}
            rooms={rooms}
            currentRoom={currentRoomData}
            onJoinRoom={onJoinRoom}
            showToast={showToast}
        />
      )}

      {isGiftPanelOpen && <ActionPanel title="Send a Gift" onClose={() => setIsGiftPanelOpen(false)}>
        <div className="grid grid-cols-4 gap-4">
          {mockGifts.map(gift => <button key={gift.id} onClick={() => handleSendGift(gift)} className="flex flex-col items-center p-2 rounded-lg bg-white/10 hover:bg-white/20"><span className="text-3xl">{gift.icon}</span><span className="text-xs mt-1">{gift.cost}</span></button>)}
        </div>
      </ActionPanel>}
      
      {isMoreOptionsOpen && <ActionPanel title="More Options" onClose={() => setIsMoreOptionsOpen(false)}>
          <div className="grid grid-cols-4 gap-y-4 text-center text-xs">
              {moreOptionsItems.filter(item => !item.hostOnly || isHost).map(item => (
                  <button key={item.label} onClick={() => { item.action(); setIsMoreOptionsOpen(false); }} className="flex flex-col items-center">
                    <span className="text-3xl mb-1">{item.icon}</span>
                    {item.label}
                  </button>
              ))}
          </div>
      </ActionPanel>}

      {isBeautyPanelOpen && <ActionPanel title="Beauty Filters" onClose={() => setIsBeautyPanelOpen(false)}>
        <div className="space-y-4 px-4">
          <div><label>Brightness</label><input type="range" min="50" max="150" value={brightness} onChange={e => setBrightness(Number(e.target.value))} className="w-full" /></div>
          <div><label>Saturation</label><input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full" /></div>
        </div>
      </ActionPanel>}

      {isPkPanelOpen && <ActionPanel title="PK Battle" onClose={() => setIsPkPanelOpen(false)}>
          <div className="text-center">
            <p>Start a PK Battle with another host!</p>
            <button onClick={() => { setPkState({ isActive: true, timer: 300, myScore: 0, opponentScore: 0, opponent: fallbackOpponent, result: null }); setIsPkPanelOpen(false); }} className="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full font-bold">Start Random PK</button>
          </div>
      </ActionPanel>}

      {pkState.isActive && pkState.opponent && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-black/70 rounded-lg text-center z-30">
            <div className="flex justify-between items-center mb-2">
                <div className={`flex flex-col items-center transition-all duration-500 ${pkState.myScore > pkState.opponentScore ? 'scale-110' : ''}`}>
                    <img src={user.avatar} className={`w-16 h-16 rounded-full border-4 ${pkState.myScore > pkState.opponentScore ? 'border-yellow-400 animate-pulse' : 'border-blue-500'}`} />
                    <p className="text-sm font-bold mt-1">{user.name}</p>
                </div>
                <div className="text-2xl font-bold text-red-500">VS</div>
                 <div className={`flex flex-col items-center transition-all duration-500 ${pkState.opponentScore > pkState.myScore ? 'scale-110' : ''}`}>
                    <img src={pkState.opponent.avatar} className={`w-16 h-16 rounded-full border-4 ${pkState.opponentScore > pkState.myScore ? 'border-yellow-400 animate-pulse' : 'border-red-500'}`} />
                    <p className="text-sm font-bold mt-1">{pkState.opponent.name}</p>
                </div>
            </div>
            <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden flex">
                <div style={{ width: `${pkState.myScore / (pkState.myScore + pkState.opponentScore || 1) * 100}%` }} className={`h-full bg-gradient-to-r ${pkState.myScore > pkState.opponentScore ? 'from-yellow-400 to-orange-500' : 'from-blue-500 to-cyan-500'} transition-all duration-500`}></div>
                <div style={{ width: `${pkState.opponentScore / (pkState.myScore + pkState.opponentScore || 1) * 100}%` }} className={`h-full bg-gradient-to-r ${pkState.opponentScore > pkState.myScore ? 'from-yellow-400 to-orange-500' : 'from-red-600 to-pink-600'} transition-all duration-500`}></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
                <span>{pkState.myScore}</span>
                <span>{pkState.opponentScore}</span>
            </div>
            <div className="mt-2 text-lg font-mono">Time: {Math.floor(pkState.timer / 60)}:{(pkState.timer % 60).toString().padStart(2, '0')}</div>
             <button onClick={handleAllInGift} className="mt-2 px-4 py-1 text-sm bg-gradient-to-r from-red-600 to-pink-600 rounded-full font-bold animate-pulse">ALL IN!</button>
        </div>
      )}

      {pkState.result && (
         <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-40 text-center">
            <h2 className={`text-6xl font-extrabold mb-4 ${pkState.result === 'win' ? 'text-yellow-400' : 'text-gray-500'}`}>{pkState.result.toUpperCase()}</h2>
            {pkState.result === 'win' && <div className="text-5xl mb-4">🏆</div>}
            <button onClick={() => setPkState({isActive: false, timer: 0, myScore: 0, opponentScore: 0, opponent: null, result: null})} className="mt-6 px-6 py-2 bg-purple-600 rounded-full">Close</button>
        </div>
      )}
      
      <div id="emoji-container" className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 overflow-hidden">
        {flyingEmojis.map(e => <div key={e.id} className="absolute bottom-24 text-4xl animate-fly-up" style={e.style}>{e.emoji}</div>)}
      </div>

    </div>
  );
};

export default RoomScreen;