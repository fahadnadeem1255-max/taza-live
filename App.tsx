import React, { useState, useEffect } from 'react';
import type { Room, User, RoomType, View, Conversation, Message } from './types';
import { mockUser, allUsers, mockRooms as initialMockRooms, mockConversations as initialConversations, mockGlobalRankings } from './constants';
import HomeScreen from './components/HomeScreen';
import RoomScreen from './components/RoomScreen';
import InboxScreen from './components/InboxScreen';
import ProfileScreen from './components/ProfileScreen';
import MyRoomSetupScreen from './components/MyRoomSetupScreen';
import BottomNav from './components/BottomNav';
import PlaceholderScreen from './components/PlaceholderScreen';
import HostingCenterScreen from './components/HostingCenterScreen';
import AgencyScreen from './components/AgencyScreen';
import VIPScreen from './components/VIPScreen';
import MallScreen from './components/MallScreen';
import RewardScreen from './components/RewardScreen';
import SettingsScreen from './components/SettingsScreen';
import LanguageScreen from './components/LanguageScreen';
import LiveRecordScreen from './components/LiveRecordScreen';
import LevelScreen from './components/LevelScreen';
import GameModal from './components/GameModal';
import AuthorityScreen from './components/AuthorityScreen';
import InviteScreen from './components/InviteScreen';
import ChatScreen from './components/ChatScreen';
import RoomSettingsScreen from './components/RoomSettingsScreen';
import RankingScreen from './components/RankingScreen'; 
import LoginScreen from './components/LoginScreen';
import ContributionScreen from './components/ContributionScreen';
import DiscoverScreen from './components/DiscoverScreen';
import PointsScreen from './components/PointsScreen';
import WithdrawScreen from './components/WithdrawScreen';
import ChannelScreen from './components/ChannelScreen';
import ExchangeScreen from './components/ExchangeScreen';

// --- NEW Password Prompt Modal ---
const PasswordPromptModal: React.FC<{ roomTitle: string; onClose: () => void; onSubmit: (password: string) => void; }> = ({ roomTitle, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 relative text-white" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center text-pink-400 mb-2">Password Required</h2>
                <p className="text-center text-sm text-gray-400 mb-6">Room "{roomTitle}" is password protected.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter room password"
                        className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"
                    />
                    <button type="submit" className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg">
                        Enter Room
                    </button>
                </form>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [viewStack, setViewStack] = useState<View[]>(['home']); 
  const activeView = viewStack[viewStack.length - 1];
  const [isViewEntered, setIsViewEntered] = useState(false);

  useEffect(() => {
    setIsViewEntered(false);
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setIsViewEntered(true);
      });
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, [activeView, isAuthenticated]);

  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [user, setUser] = useState<User>(mockUser);
  
  const [myRoomTitle, setMyRoomTitle] = useState(`${mockUser.name}'s Awesome Stream`);
  const [myRoomCoverImage, setMyRoomCoverImage] = useState<string | null>('https://picsum.photos/seed/my-room/400/300');
  
  const [isMyRoomLive, setIsMyRoomLive] = useState<boolean>(false);
  const [myRoom, setMyRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>(initialMockRooms);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const [viewedProfile, setViewedProfile] = useState<User | null>(null);

  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [roomToJoin, setRoomToJoin] = useState<Room | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  
  const resetStateForNewSession = () => {
    setUser(mockUser);
    setConversations(initialConversations);
    setRooms(initialMockRooms);
    setCurrentRoom(null);
    setActiveConversation(null);
    setViewedProfile(null);
    setMyRoom(null);
    setIsMyRoomLive(false);
    setMyRoomTitle(`${mockUser.name}'s Awesome Stream`);
    setMyRoomCoverImage('https://picsum.photos/seed/my-room/400/300'); 
    setViewStack(['home']);
  };

  const handleLogin = (newUserData?: Partial<User>) => {
    resetStateForNewSession();
    if (newUserData) {
      setUser(prev => ({...prev, ...newUserData}));
      showToast(`Welcome, ${newUserData.name}! Your profile is set.`);
    } else {
      showToast("Login successful!");
    }
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    showToast("You have been logged out.");
    resetStateForNewSession();
    setIsAuthenticated(false);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
        setToastVisible(false);
        setTimeout(() => setToastMessage(null), 500); // Allow time for fade out
    }, 2500); 
  };

  const handleNavigate = (view: View) => {
    setViewStack(prev => [...prev, view]);
  };
  
  const handleBack = () => {
    if (activeView === 'chat') {
      setActiveConversation(null);
    }
    if (activeView === 'profile' && viewedProfile) {
      setViewedProfile(null);
    }
    setViewStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  };
  
  const handleSetView = (view: View) => {
    if (['home', 'discover', 'myRoom', 'notifications', 'profile'].includes(view)) {
       if (view === 'profile') {
        setViewedProfile(null); // When using bottom nav, always go to my profile
      }
      setViewStack([view]);
    } else {
      handleNavigate(view);
    }
  }

  const handleJoinRoom = (room: Room) => {
     if (room.mode === 'Password' && room.host.id !== user.id) {
        setRoomToJoin(room);
        setIsPasswordPromptVisible(true);
        return;
    }
    setCurrentRoom(room);
    handleNavigate('room');
  };

  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('room=')) {
        const match = hash.match(/room=([^&]+)/);
        if (match && match[1]) {
          const roomId = decodeURIComponent(match[1]);
          const target = rooms.find(r => r.id === roomId);
          if (target) {
            handleJoinRoom(target);
          }
        }
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [rooms]);
  
  const handlePasswordSubmit = (password: string) => {
    if (roomToJoin && password === roomToJoin.password) {
      setIsPasswordPromptVisible(false);
      setCurrentRoom(roomToJoin);
      handleNavigate('room');
      setRoomToJoin(null);
    } else {
      showToast("Incorrect password!");
    }
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    handleBack(); // Go back instead of resetting to home
  };
  
  const handleStartStream = (title: string, type: RoomType, coverImage: string) => {
    const newRoom: Room = {
      id: `my-room-${Date.now()}`,
      title,
      type,
      host: user,
      coverImage: coverImage,
      viewers: 0,
      participants: [user],
      theme: 'Colorful', // Default settings
      mood: 'Chill',
      seatCapacity: 20,
      mode: 'Public',
    };
    setMyRoom(newRoom);
    setIsMyRoomLive(true);
    setRooms(prev => [newRoom, ...prev]);
    // Navigate into the room as the host
    setCurrentRoom(newRoom);
    handleNavigate('room');
  };
  
  const handleStopStream = () => {
    setIsMyRoomLive(false);
    setRooms(prev => prev.filter(r => r.id !== myRoom?.id));
    setMyRoom(null);
    setCurrentRoom(null);
    // Go back to the setup screen
    handleSetView('myRoom');
  };

  const handleJoinConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    handleNavigate('chat');
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'voice') => {
    if (!activeConversation) return;

    const costs = { text: 1, image: 2, voice: 2 };
    const cost = costs[type];

    if (user.coins < cost) {
        showToast(`Not enough coins! This action costs ${cost} coin(s).`);
        return;
    }

    setUser(prevUser => ({...prevUser, coins: prevUser.coins - cost}));

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      user: user,
      type: type,
      text: type === 'text' ? content : (type === 'image' ? 'Image' : 'Voice Message'),
      mediaUrl: type !== 'text' ? content : undefined,
      duration: type === 'voice' ? '0:07' : undefined, // dummy duration
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedConversations = conversations.map(convo =>
      convo.id === activeConversation.id
        ? { ...convo, messages: [...convo.messages, newMessage] }
        : convo
    );
    setConversations(updatedConversations);
    
    // Also update the active conversation to re-render the chat screen
    setActiveConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
  };

  const handleViewProfile = (profileToView: User) => {
    if (profileToView.id === user.id) {
      handleSetView('profile'); // Don't push, just go to my profile root view
      return;
    }
    setViewedProfile(profileToView);
    handleNavigate('profile');
  };
  
  const handleUpdateRoomSettings = (updatedSettings: Partial<Room>) => {
    if (!currentRoom || currentRoom.host.id !== user.id) return;
    
    const updatedRoom: Room = { ...currentRoom, ...updatedSettings };

    setCurrentRoom(updatedRoom);
    if (myRoom?.id === updatedRoom.id) {
      setMyRoom(updatedRoom);
    }
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
  };
  
  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomeScreen rooms={rooms} onJoinRoom={handleJoinRoom} user={user} setUser={setUser} showToast={showToast} />;
      case 'room':
        return currentRoom ? <RoomScreen room={currentRoom} rooms={rooms} onJoinRoom={handleJoinRoom} onLeave={handleLeaveRoom} user={user} setUser={setUser} onStopStream={handleStopStream} onViewProfile={handleViewProfile} onNavigate={handleSetView} showToast={showToast} onOpenGameModal={() => setIsGameModalOpen(true)} /> : <HomeScreen rooms={rooms} onJoinRoom={handleJoinRoom} user={user} setUser={setUser} showToast={showToast} />;
      case 'notifications':
        return <InboxScreen conversations={conversations} onJoinConversation={handleJoinConversation} />;
      case 'chat':
        return activeConversation ? <ChatScreen conversation={activeConversation} currentUser={user} onBack={handleBack} onSendMessage={handleSendMessage} showToast={showToast} /> : <InboxScreen conversations={conversations} onJoinConversation={handleJoinConversation} />;
      case 'profile':
        return <ProfileScreen key={viewedProfile?.id || user.id} currentUser={user} profileUser={viewedProfile} setUser={setUser} onNavigate={handleSetView} onBack={handleBack} showToast={showToast} onOpenGameModal={() => setIsGameModalOpen(true)} />;
      case 'myRoom':
        return <MyRoomSetupScreen 
                  user={user} 
                  onStartStream={handleStartStream} 
                  roomTitle={myRoomTitle}
                  setRoomTitle={setMyRoomTitle}
                  coverImage={myRoomCoverImage}
                  setCoverImage={setMyRoomCoverImage}
                />;
      
      // Functional screens for profile items
      case 'hostingCenter': return <HostingCenterScreen onBack={handleBack} />;
      case 'agency': return <AgencyScreen onBack={handleBack} />;
      case 'vip': return <VIPScreen onBack={handleBack} />;
      case 'mall': return <MallScreen onBack={handleBack} user={user} setUser={setUser} />;
      case 'reward':
      case 'missions':
        return <RewardScreen onBack={handleBack} user={user} setUser={setUser} showToast={showToast} />;
      case 'settings': return <SettingsScreen onBack={handleBack} onNavigate={handleSetView} showToast={showToast} onLogout={handleLogout} />;
      case 'liveRecord': return <LiveRecordScreen onBack={handleBack} />;
      case 'level': return <LevelScreen onBack={handleBack} user={user} />;
      case 'authority': return <AuthorityScreen onBack={handleBack} />;
      case 'invite': return <InviteScreen onBack={handleBack} user={user} showToast={showToast} />;
      case 'ranking': return <RankingScreen rankings={mockGlobalRankings} onBack={handleBack} />;
      case 'contribution':
        const contributionUser = viewedProfile || user;
        return <ContributionScreen user={contributionUser} onBack={handleBack} />;
      case 'points': return <PointsScreen onBack={handleBack} user={user} onNavigate={handleSetView} />;
      case 'withdraw': return <WithdrawScreen onBack={handleBack} user={user} setUser={setUser} showToast={showToast} onNavigate={handleSetView} />;
      case 'channel': return <ChannelScreen onBack={handleBack} />;
      case 'exchange': return <ExchangeScreen onBack={handleBack} user={user} setUser={setUser} showToast={showToast} />;

      // Settings sub-screens
      case 'accountAndSecurity': return <PlaceholderScreen title="Account & Security" onBack={handleBack} />;
      case 'changePhoneNumber': return <PlaceholderScreen title="Change Phone Number" onBack={handleBack} />;
      case 'resetPassword': return <PlaceholderScreen title="Reset Password" onBack={handleBack} />;
      case 'notificationsSettings': return <PlaceholderScreen title="Notifications" onBack={handleBack} />;
      case 'language': return <LanguageScreen onBack={handleBack} showToast={showToast} />;
      case 'userAgreement': return <PlaceholderScreen title="User Agreement" onBack={handleBack} />;
      case 'privacyPolicy': return <PlaceholderScreen title="Privacy Policy" onBack={handleBack} />;
      case 'about': return <PlaceholderScreen title="About" onBack={handleBack} />;
      case 'roomSettings': return <RoomSettingsScreen room={currentRoom} onUpdateSettings={handleUpdateRoomSettings} onBack={handleBack} showToast={showToast} onNavigate={handleSetView} />;
      
      // Room Settings Sub-views
      case 'giftRecord': return <PlaceholderScreen title="Gift Record" onBack={handleBack} />;
      case 'roomManager': return <PlaceholderScreen title="Room Manager" onBack={handleBack} />;
      case 'blockList': return <PlaceholderScreen title="Block List" onBack={handleBack} />;
      case 'roomTips': return <PlaceholderScreen title="Room Tips" onBack={handleBack} />;

      // Placeholder screens for profile items
      case 'discover': return <DiscoverScreen users={allUsers} onNavigate={handleSetView} onViewProfile={handleViewProfile} showToast={showToast} />;
      case 'feedback': return <PlaceholderScreen title="Feedback" onBack={handleBack} />;
      case 'myRooms': return <PlaceholderScreen title="My Rooms" onBack={handleBack} />;
      case 'batch': return <PlaceholderScreen title="Batch" onBack={handleBack} />; // Renamed from 'badge' to match image grid
      case 'call': return <PlaceholderScreen title="Call" onBack={handleBack} />;
      case 'gameShare': return <PlaceholderScreen title="Game Share" onBack={handleBack} />;
        
      default:
        return <ProfileScreen currentUser={user} setUser={setUser} onNavigate={handleSetView} showToast={showToast} onOpenGameModal={() => setIsGameModalOpen(true)} />;
    }
  };
  
  const showNav = ['home', 'discover', 'notifications', 'profile'].includes(activeView) && !viewedProfile;

  return (
    <div
      className={`w-full min-h-screen font-sans flex flex-col max-w-lg mx-auto bg-gradient-to-br from-indigo-900 via-black to-purple-900 entrance-fade-slide-up transition-all duration-300 ease-out ${
        isViewEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'
      }`}
      style={{
        transitionProperty: 'opacity, transform',
        transitionDuration: '300ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} showToast={showToast} />
      ) : (
        <>
          <main className={`flex-grow ${showNav || activeView === 'myRoom' ? 'pb-24' : ''}`}>
            {renderContent()}
          </main>
          {(showNav || activeView === 'myRoom') && <BottomNav activeView={activeView} setActiveView={handleSetView} />}
          
          {isPasswordPromptVisible && roomToJoin && (
            <PasswordPromptModal
              roomTitle={roomToJoin.title}
              onClose={() => setIsPasswordPromptVisible(false)}
              onSubmit={handlePasswordSubmit}
            />
          )}

          {toastMessage && (
            <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg z-50 transition-opacity duration-500 ${toastVisible ? 'opacity-100' : 'opacity-0'}`}>
                {toastMessage}
            </div>
          )}

          <GameModal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default App;