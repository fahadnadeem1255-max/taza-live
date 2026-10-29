import React from 'react';
import type { View } from '../types';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
  showToast: (message: string) => void;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate, showToast, onLogout }) => {
  
  const accountSettings = [
    { label: 'Account & Security', view: 'accountAndSecurity' as View },
    { label: 'Change phone number', view: 'changePhoneNumber' as View },
    { label: 'Reset password', view: 'resetPassword' as View },
  ];

  const generalSettings = [
    { label: 'Block List', view: 'blockList' as View },
    { label: 'Notifications', view: 'notificationsSettings' as View },
    { label: 'Language', view: 'language' as View },
    { label: 'Clear cache', action: () => showToast('Cache has been cleared!') },
  ];

  const legalSettings = [
    { label: 'User Agreement', view: 'userAgreement' as View },
    { label: 'Privacy Policy', view: 'privacyPolicy' as View },
    { label: 'About', view: 'about' as View },
  ];

  const renderSettingSection = (title: string, items: ({ label: string; view?: View; action?: () => void; })[]) => (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-purple-400 px-4 mb-2">{title}</h2>
      <div className="space-y-2">
        {items.map(item => (
          <button 
            key={item.label} 
            onClick={() => item.action ? item.action() : onNavigate(item.view!)}
            className="w-full text-left p-4 rounded-lg bg-black/50 border border-purple-800 flex justify-between items-center hover:bg-purple-900/30"
          >
            <span>{item.label}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    </div>
  );


  return (
    <div className="p-4 h-screen flex flex-col text-white">
      <header className="relative flex items-center justify-center mb-6 h-12">
        <button onClick={onBack} className="absolute left-0 p-2 text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-purple-400">Settings</h1>
      </header>
      <div className="flex-grow flex flex-col justify-between overflow-y-auto">
        <div>
          {renderSettingSection('Account', accountSettings)}
          {renderSettingSection('General', generalSettings)}
          {renderSettingSection('Legal', legalSettings)}
        </div>
        <div className="py-4">
             <button 
                onClick={onLogout}
                className="w-full p-4 rounded-lg bg-pink-800/50 text-pink-300 font-bold hover:bg-pink-700/50"
             >
                Log Out
             </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;