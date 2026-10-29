import React, { useState } from 'react';
import type { Room } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  showToast: (message: string) => void;
  onShareCompleted?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  room,
  showToast,
  onShareCompleted,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Create a clean, universal shareable URL and text
  const shareUrl = `${window.location.origin}/#room=${encodeURIComponent(room.id)}`;
  const shareTitle = `🔴 Join ${room.host.name}'s Live Stream!`;
  const shareText = `Hey! I'm watching "${room.title}" on Social Live. Come join the party with ${room.viewers} other viewers! 🎙️✨`;
  const roomCode = `RM-${room.id.slice(-6).toUpperCase()}`;

  const triggerShareMissionUpdate = () => {
    try {
      const saved = localStorage.getItem('social_live_daily_missions');
      if (saved) {
        const missions = JSON.parse(saved);
        const updated = missions.map((m: any) =>
          m.id === 'm6' || m.actionType === 'share_room'
            ? { ...m, currentProgress: Math.min(m.targetProgress, m.currentProgress + 1) }
            : m
        );
        localStorage.setItem('social_live_daily_missions', JSON.stringify(updated));
      }
    } catch {
      // Ignore
    }
    onShareCompleted?.();
  };

  const copyToClipboard = async (textToCopy: string, isCode = false) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for iframe environments
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (isCode) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
        showToast(`Room code ${roomCode} copied!`);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast('Stream invite link copied to clipboard! 📋');
      }

      triggerShareMissionUpdate();
    } catch {
      showToast('Link ready: ' + shareUrl);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showToast('Thank you for sharing the stream! 🎉');
        triggerShareMissionUpdate();
        onClose();
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const socialChannels = [
    {
      name: 'WhatsApp',
      icon: '💬',
      bg: 'bg-emerald-600 hover:bg-emerald-500',
      getUrl: () =>
        `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      bg: 'bg-sky-500 hover:bg-sky-400',
      getUrl: () =>
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      bg: 'bg-neutral-800 hover:bg-neutral-700',
      getUrl: () =>
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: '👥',
      bg: 'bg-blue-600 hover:bg-blue-500',
      getUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'SMS',
      icon: '📱',
      bg: 'bg-purple-600 hover:bg-purple-500',
      getUrl: () =>
        `sms:?&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    },
  ];

  const handleSocialClick = (channel: typeof socialChannels[0]) => {
    const url = channel.getUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`Opening ${channel.name} to invite friends...`);
    triggerShareMissionUpdate();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 border-t sm:border border-purple-500/70 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effects */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/40 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-lg shadow-md shadow-pink-500/30">
              🔗
            </div>
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                Share Live Stream
              </h2>
              <p className="text-[11px] text-gray-400">Invite friends & earn mission rewards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-3.5 space-y-3.5 relative z-10 pr-0.5">
          {/* Room Invite Card Preview */}
          <div className="rounded-2xl bg-black/50 border border-purple-700/60 p-3 flex items-center gap-3 shadow-inner">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-purple-600/60">
              <img
                src={room.coverImage}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-red-600/90 text-[8px] font-black uppercase rounded tracking-wider text-white">
                {room.type === 'video' ? 'LIVE' : 'AUDIO'}
              </span>
            </div>

            <div className="min-w-0 flex-grow">
              <h3 className="font-bold text-sm text-white truncate leading-tight">
                {room.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400 truncate">
                <img
                  src={room.host.avatar}
                  alt={room.host.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="truncate">Host: {room.host.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-pink-300">
                <span>👁️ {room.viewers.toLocaleString()} watching</span>
                <span>•</span>
                <span className="text-yellow-300">Code: {roomCode}</span>
              </div>
            </div>
          </div>

          {/* Native Share Intent Button (Mobile & Desktop) */}
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>📲</span>
            <span>Share via Apps & Messages...</span>
          </button>

          {/* Social Channels Row */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">
              Share directly to
            </p>
            <div className="grid grid-cols-5 gap-2">
              {socialChannels.map((channel) => (
                <button
                  key={channel.name}
                  onClick={() => handleSocialClick(channel)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-black/40 hover:bg-purple-950/50 border border-purple-800/40 hover:border-pink-500/60 transition-all hover:scale-105 active:scale-95 text-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg text-white shadow ${channel.bg}`}
                  >
                    {channel.icon}
                  </div>
                  <span className="text-[10px] text-gray-300 font-medium truncate w-full">
                    {channel.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shareable Link Box with Quick Copy */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Shareable Room Link
              </label>
              <button
                onClick={() => copyToClipboard(roomCode, true)}
                className="text-[10px] text-pink-400 hover:text-pink-300 font-medium"
              >
                {copiedCode ? '✓ Code Copied' : 'Copy Room Code'}
              </button>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-purple-800/80 shadow-inner">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-purple-200 px-2.5 py-1.5 flex-grow truncate focus:outline-none select-all"
              />
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all active:scale-95 flex items-center gap-1 flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-purple-800/40 flex items-center justify-between text-[11px] text-gray-400 relative z-10 flex-shrink-0">
          <span className="flex items-center gap-1 text-purple-300">
            <span>🎁</span>
            <span>Sharing rewards: <strong>+180 Coins</strong> (Daily Mission)</span>
          </span>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
