import React from 'react';
import type { Conversation } from '../types';

interface InboxScreenProps {
  conversations: Conversation[];
  onJoinConversation: (conversation: Conversation) => void;
}

const InboxScreen: React.FC<InboxScreenProps> = ({ conversations, onJoinConversation }) => {

  const getLastMessage = (conversation: Conversation) => {
    return conversation.messages[conversation.messages.length - 1];
  };

  return (
    <div className="p-4 h-screen flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Inbox</h1>
        <button className="text-purple-400 hover:text-purple-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        </button>
      </header>
      
      <div className="space-y-2 flex-grow overflow-y-auto">
        {conversations.map(convo => {
          const lastMessage = getLastMessage(convo);
          return (
            <div 
              key={convo.id} 
              className="flex items-center p-3 bg-black/50 border border-purple-900 rounded-lg cursor-pointer hover:bg-purple-900/30 transition-colors"
              onClick={() => onJoinConversation(convo)}
            >
              <img src={convo.user.avatar} alt={convo.user.name} className="w-12 h-12 rounded-full" />
              <div className="ml-4 flex-grow overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-white">{convo.user.name}</p>
                  <p className="text-xs text-gray-400 flex-shrink-0">{lastMessage.timestamp}</p>
                </div>
                <p className="text-sm text-gray-300 truncate">{lastMessage.text}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default InboxScreen;