import React from 'react';
import type { Conversation } from '../types';

interface InboxScreenProps {
  conversations: Conversation[];
  blockedUserIds?: string[];
  onJoinConversation: (conversation: Conversation) => void;
}

const InboxScreen: React.FC<InboxScreenProps> = ({ conversations, blockedUserIds = [], onJoinConversation }) => {
  const getLastMessage = (conversation: Conversation) => {
    return conversation.messages[conversation.messages.length - 1];
  };

  // Filter out any conversation with a blocked user
  const activeConversations = conversations.filter(
    convo => !blockedUserIds.includes(convo.user.id)
  );

  return (
    <div className="p-4 h-screen flex flex-col bg-gradient-to-br from-indigo-950 via-black to-purple-950 text-white">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Inbox</h1>
          <p className="text-xs text-gray-400">Direct messages and notifications</p>
        </div>
        <button className="text-purple-400 hover:text-purple-300 p-2 rounded-full bg-black/40 border border-purple-800/40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </header>

      <div className="space-y-2 flex-grow overflow-y-auto pb-24">
        {activeConversations.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-800/50 flex items-center justify-center text-2xl mb-3">
              💬
            </div>
            <p className="text-sm font-semibold text-white">No active conversations</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Messages from blocked users are hidden. You can connect with new friends in live rooms!
            </p>
          </div>
        ) : (
          activeConversations.map(convo => {
            const lastMessage = getLastMessage(convo);
            return (
              <div
                key={convo.id}
                className="flex items-center p-3 bg-black/50 border border-purple-900 rounded-xl cursor-pointer hover:bg-purple-900/30 transition-all shadow-md active:scale-[0.99]"
                onClick={() => onJoinConversation(convo)}
              >
                <div className="relative">
                  <img src={convo.user.avatar} alt={convo.user.name} className="w-12 h-12 rounded-full object-cover border border-purple-600/60" />
                  {convo.user.vipLevel > 0 && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] bg-yellow-500 text-black font-extrabold px-1 rounded-full">
                      V{convo.user.vipLevel}
                    </span>
                  )}
                </div>
                <div className="ml-3.5 flex-grow overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-white text-sm truncate">{convo.user.username || convo.user.name}</p>
                    <p className="text-[11px] text-gray-400 flex-shrink-0 ml-2">{lastMessage?.timestamp || ''}</p>
                  </div>
                  <p className="text-xs text-gray-300 truncate mt-0.5">{lastMessage?.text || 'No message yet'}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InboxScreen;