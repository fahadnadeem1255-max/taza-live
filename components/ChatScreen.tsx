import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, User, Message } from '../types';

interface ChatScreenProps {
  conversation: Conversation;
  currentUser: User;
  onBack: () => void;
  onSendMessage: (content: string, type: 'text' | 'image' | 'voice') => void;
  showToast: (message: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ conversation, currentUser, onBack, onSendMessage, showToast }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendText = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, 'text');
      setInputValue('');
    }
  };

  const handleSendVoice = () => {
    // Simulate sending a voice message
    onSendMessage('voice_message_url', 'voice');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendMessage(reader.result as string, 'image');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'image':
        return <img src={message.mediaUrl} alt="Sent" className="max-w-full rounded-lg" />;
      case 'voice':
        return (
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
            <span>{message.duration}</span>
            <div className="w-24 h-1 bg-gray-500 rounded-full"><div className="w-1/2 h-full bg-white rounded-full"></div></div>
          </div>
        );
      case 'text':
      default:
        return <p className="text-sm">{message.text}</p>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="relative flex items-center justify-center p-4 border-b border-purple-800 flex-shrink-0">
        <button onClick={onBack} className="absolute left-4 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
            <p className="text-lg font-bold">{conversation.user.name}</p>
            <p className="text-xs text-green-500">Online</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(message => {
          const isSentByMe = message.user.id === currentUser.id;
          return (
            <div key={message.id} className={`flex items-end gap-2 ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
              {!isSentByMe && <img src={message.user.avatar} alt={message.user.name} className="w-8 h-8 rounded-full" />}
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isSentByMe ? 'bg-pink-600 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
                {renderMessageContent(message)}
                <p className={`text-xs mt-1 text-right ${isSentByMe ? 'text-pink-200' : 'text-gray-400'}`}>{message.timestamp}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-purple-800 flex-shrink-0">
        <div className="flex items-center space-x-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <button onClick={handleSendVoice} className="p-2 text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0a5 5 0 01-5 5A5 5 0 015 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
            </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Type a message..."
            className="flex-grow bg-gray-800 border border-purple-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSendText}
            className="bg-pink-600 text-white rounded-full p-3 flex-shrink-0 hover:bg-pink-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
         <div className="text-xs text-gray-500 text-center mt-2">
            Text: 1 coin | Voice: 2 coins | Picture: 2 coins
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;