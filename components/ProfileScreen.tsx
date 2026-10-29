import React, { useState, useRef } from 'react';
import type { User, View, PaymentMethod, CountryPaymentOptions } from '../types';
import { paymentOptionsByCountry } from '../constants';

// NOTE: AI Bio generation has been removed to match the new design.

// --- Helper Components for the new Profile Design ---

interface PurchaseCoinsModalProps {
  onPurchase: (amount: number) => void;
  onClose: () => void;
}

const PurchaseCoinsModal: React.FC<PurchaseCoinsModalProps> = ({ onPurchase, onClose }) => {
    const coinPackages = [ { coins: 100, price: 0.99 }, { coins: 550, price: 4.99 }, { coins: 1200, price: 9.99 }, { coins: 2500, price: 19.99 }];
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 relative text-white" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">Get Coins</h2>
           <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
          <div className="grid grid-cols-2 gap-4">
            {coinPackages.map(pkg => (
              <button key={pkg.coins} onClick={() => { onPurchase(pkg.coins); }} className="p-4 bg-gray-800 rounded-lg text-center hover:bg-yellow-600 transition-all border border-purple-800">
                <span className="text-xl font-bold text-yellow-400">{pkg.coins.toLocaleString()}</span>
                <p className="mt-1 text-sm">${pkg.price.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
)};

interface WithdrawalModalProps {
  user: User;
  onClose: () => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  showToast: (message: string) => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ user, onClose, setUser, showToast }) => {
    const [step, setStep] = useState<'selectCountry' | 'selectMethod' | 'enterDetails'>('selectCountry');
    const [selectedCountry, setSelectedCountry] = useState<CountryPaymentOptions | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [formData, setFormData] = useState<{ [key: string]: string }>({ amount: '' });

    const handleSelectCountry = (country: CountryPaymentOptions) => {
        setSelectedCountry(country);
        setStep('selectMethod');
    };

    const handleSelectMethod = (method: PaymentMethod) => {
        setSelectedMethod(method);
        // Reset form data for the new method, keeping amount if it was entered
        const newFormData = { amount: formData.amount };
        method.fields.forEach(field => {
            newFormData[field.name] = '';
        });
        setFormData(newFormData);
        setStep('enterDetails');
    };
    
    const handleExchange = () => {
        setSelectedCountry(null);
        setSelectedMethod({ id: 'exchange', name: 'Exchange for Coins', type: 'wallet', fields: [] });
        setFormData({ amount: '' });
        setStep('enterDetails');
    };

    const handleBack = () => {
        if (step === 'enterDetails') {
            if (selectedMethod?.id === 'exchange') {
                 setStep('selectCountry');
            } else {
                 setStep('selectMethod');
            }
        } else if (step === 'selectMethod') {
            setStep('selectCountry');
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const withdrawalAmount = parseInt(formData.amount, 10);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            showToast('Please enter a valid amount.');
            return;
        }
        if (withdrawalAmount > user.points) {
            showToast('Insufficient points for this withdrawal.');
            return;
        }

        if (selectedMethod?.id === 'exchange') {
            setUser(prev => ({
                ...prev,
                points: prev.points - withdrawalAmount,
                coins: prev.coins + withdrawalAmount, // 1:1 exchange rate
            }));
            showToast(`${withdrawalAmount.toLocaleString()} points exchanged for coins!`);
        } else {
            setUser(prev => ({ ...prev, points: prev.points - withdrawalAmount }));
            showToast(`Withdrawal request for ${withdrawalAmount.toLocaleString()} submitted!`);
        }
        onClose();
    };
    
    const renderContent = () => {
        const headerTitle = step === 'selectCountry' ? 'Select Country' :
                            step === 'selectMethod' ? 'Select Method' :
                            selectedMethod?.name || 'Enter Details';

        const showBackButton = step !== 'selectCountry';

        return (
            <>
                <header className="relative flex items-center justify-center mb-4 pb-2 border-b border-purple-800">
                    {showBackButton && (
                        <button onClick={handleBack} className="absolute left-0 text-gray-400 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-center text-pink-400">{headerTitle}</h2>
                </header>

                {step === 'selectCountry' && (
                    <div className="space-y-2">
                        <button onClick={handleExchange} className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-pink-600/50">Exchange for Coins</button>
                        {paymentOptionsByCountry.map(option => (
                            <button key={option.country} onClick={() => handleSelectCountry(option)} className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-pink-600/50">
                                {option.country}
                            </button>
                        ))}
                    </div>
                )}

                {step === 'selectMethod' && selectedCountry && (
                    <div className="space-y-2">
                        {selectedCountry.methods.map(method => (
                             <button key={method.id} onClick={() => handleSelectMethod(method)} className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-pink-600/50">
                                {method.name}
                            </button>
                        ))}
                    </div>
                )}
                
                {step === 'enterDetails' && selectedMethod && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">{selectedMethod.id === 'exchange' ? 'Amount to Exchange' : 'Amount to Withdraw'}</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} placeholder={`Available: ${user.points.toLocaleString()}`} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"/>
                        </div>
                        {selectedMethod.fields.map(field => (
                             <div key={field.name}>
                                <label className="text-sm text-gray-400">{field.label}</label>
                                <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} placeholder={field.placeholder} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"/>
                            </div>
                        ))}
                         <button onClick={handleSubmit} className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg">
                            {selectedMethod.id === 'exchange' ? 'Exchange Now' : 'Submit Request'}
                        </button>
                    </div>
                )}
            </>
        )
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 relative text-white" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl">&times;</button>
                {renderContent()}
            </div>
        </div>
    );
};


interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, setUser }) => {
    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setUser(prev => ({ 
            ...prev, 
            name, 
            username, 
            bio,
            avatar: avatarPreview || prev.avatar 
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 relative text-white" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-center text-pink-400 mb-6">Edit Profile</h2>
                
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img 
                            src={avatarPreview || user.avatar} 
                            alt="Avatar Preview" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Display Name</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"/>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Short Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"/>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1" rows={3}></textarea>
                    </div>
                </div>
                <button onClick={handleSave} className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg">Save Changes</button>
            </div>
        </div>
    );
};

// --- NEW SVG ICONS FOR PROFILE GRID ---
const InviteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>);
const RewardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 1014.625 7.5H9.375A2.625 2.625 0 1012 4.875zM21 11.25H3v1.875h18v-1.875z" /></svg>);
const AuthorityIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>);
const ContributionIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>);
const BadgeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.258-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-.07.042m15.482 0l.07.042m-4.5 0a48.291 48.291 0 00-4.5.082V11.1a48.291 48.291 0 004.5.082m0 0l.07.042m-4.5-4.208a48.567 48.567 0 014.5 0m-4.5 0V6.345m0 0a48.567 48.567 0 014.5 0m0 0v4.755" /></svg>);
const MallIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>);
const GameIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M15.75 12.75l-2.25 2.25-2.25-2.25m4.5-4.5l-2.25-2.25-2.25 2.25" /><path d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path d="M5.25 9.375h.008v.008H5.25v-.008zM9.375 5.25h.008v.008H9.375V5.25zm5.25 0h.008v.008h-.008V5.25zm3.938 4.125h.008v.008h-.008V9.375zM12 18.75a.375.375 0 110-.75.375.375 0 010 .75z" /></svg>);
const CallIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>);
const MyRoomIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>);
const LevelIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>);
const GameShareIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.186 2.25 2.25 0 00-3.933 2.186z" /></svg>);
const FeedbackIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>);
const HistoryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.42.346.564.945.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.941-1.11.941h-2.593c-.55 0-1.02-.398-1.11-.941l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495-.645-.87l.213-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);


interface ProfileIconGridProps {
  items: { label: string; icon: React.ReactNode; view: View, notification?: string, check?: boolean }[];
  onNavigate: (view: View) => void;
}
const ProfileIconGrid: React.FC<ProfileIconGridProps> = ({ items, onNavigate }) => (
    <div className="grid grid-cols-4 gap-y-4">
        {items.map(item => (
            <div key={item.label} className="flex flex-col items-center text-center cursor-pointer" onClick={() => onNavigate(item.view)}>
                <div className="relative">
                    <div className="w-9 h-9 flex items-center justify-center">{item.icon}</div>
                    {item.notification && <span className="absolute -top-2 -right-3 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">{item.notification}</span>}
                    {item.check && <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full leading-none">✓</span>}
                </div>
                <span className="text-xs text-gray-400 mt-1">{item.label}</span>
            </div>
        ))}
    </div>
);


// --- Main Profile Screen Component ---

interface ProfileScreenProps {
  currentUser: User;
  profileUser?: User | null;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  onNavigate: (view: View) => void;
  showToast: (message: string) => void;
  onOpenGameModal: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, profileUser, setUser, onNavigate, showToast, onOpenGameModal }) => {
  const userToDisplay = profileUser || currentUser;
  const isMyProfile = userToDisplay.id === currentUser.id;
  
  // Use local state for the displayed user to handle visual updates like follow count
  const [displayedUser, setDisplayedUser] = useState(userToDisplay);
  const [isFollowing, setIsFollowing] = useState(false); // In a real app, this would come from user data

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleFollowToggle = () => {
    // This is a local visual update. In a real app, this would be an API call.
    setDisplayedUser(prevUser => ({
        ...prevUser,
        fans: isFollowing ? prevUser.fans - 1 : prevUser.fans + 1,
    }));
    setIsFollowing(prev => !prev);
  };

  const handlePurchaseCoins = (amount: number) => {
    // Purchases always affect the logged-in user
    setUser(prev => ({ ...prev, coins: prev.coins + amount }));
    setIsPurchaseModalOpen(false);
    showToast(`${amount.toLocaleString()} coins added!`);
  };
  
  const mainGridItems = [
    { label: 'Invite', icon: <InviteIcon />, view: 'invite' as View, notification: 'to450k co' },
    { label: 'Reward', icon: <RewardIcon />, view: 'reward' as View },
    { label: 'Authority', icon: <AuthorityIcon />, view: 'authority' as View, check: true },
    { label: 'Contribution', icon: <ContributionIcon />, view: 'contribution' as View },
    { label: 'Badge', icon: <BadgeIcon />, view: 'batch' as View },
    { label: 'Mall', icon: <MallIcon />, view: 'mall' as View },
    { label: 'Game', icon: <GameIcon />, view: 'game' as View },
    { label: 'Call', icon: <CallIcon />, view: 'call' as View },
  ];

  const secondaryGridItems = [
    { label: 'My Room', icon: <MyRoomIcon />, view: 'myRoom' as View },
    { label: 'Level', icon: <LevelIcon />, view: 'level' as View },
    { label: 'Game Share', icon: <GameShareIcon />, view: 'gameShare' as View },
    { label: 'Feedback', icon: <FeedbackIcon />, view: 'feedback' as View },
    { label: 'History', icon: <HistoryIcon />, view: 'liveRecord' as View },
    { label: 'Settings', icon: <SettingsIcon />, view: 'settings' as View },
  ];

  const handleGridNavigate = (view: View) => {
    if (view === ('game' as any)) { // Cast because 'game' is removed from View type
        onOpenGameModal();
    } else {
        onNavigate(view);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-y-auto pb-24 bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      {/* Profile Header */}
      <div className="relative h-48">
        <img src={displayedUser.frameUrl || 'https://picsum.photos/seed/bg/400/200'} alt="Profile background" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        {isMyProfile && (
            <button onClick={() => onNavigate('settings')} className="absolute top-4 right-4 text-white p-2 bg-black/30 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.42.346.564.945.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 01-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.941-1.11.941h-2.593c-.55 0-1.02-.398-1.11-.941l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495-.645-.87l.213-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        )}
      </div>

      {/* User Info Section */}
      <div className="relative -mt-16 px-4">
        <div className="flex items-end">
            <div className="relative">
                <img src={displayedUser.avatar} alt={displayedUser.name} className="w-28 h-28 rounded-full object-cover border-4 border-purple-800" />
                <img src={displayedUser.vipBadgeUrl} alt="VIP" className="absolute bottom-2 right-0 w-8 h-8" />
            </div>
            <div className="ml-4 flex-grow">
                <h1 className="text-2xl font-bold">{displayedUser.username}</h1>
                <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-400">ID: {displayedUser.idNumber}</p>
                </div>
            </div>
             {isMyProfile && <button onClick={() => setIsEditModalOpen(true)} className="ml-auto px-4 py-2 text-sm font-semibold border-2 border-pink-500 rounded-full hover:bg-pink-500/20">Edit Profile</button>}
             {!isMyProfile && <button onClick={handleFollowToggle} className={`ml-auto px-6 py-2 text-sm font-semibold rounded-full ${isFollowing ? 'bg-gray-700 text-gray-300' : 'bg-pink-600 text-white'}`}>{isFollowing ? 'Following' : 'Follow'}</button>}
        </div>
        
        {/* Bio */}
        <p className="mt-4 text-sm text-gray-300">{displayedUser.bio}</p>

        {/* Stats */}
        <div className="flex justify-around text-center my-6">
            <div><p className="font-bold text-lg">{displayedUser.follow}</p><p className="text-xs text-gray-400">Follow</p></div>
            <div><p className="font-bold text-lg">{displayedUser.friends}</p><p className="text-xs text-gray-400">Friends</p></div>
            <div><p className="font-bold text-lg">{displayedUser.fans}</p><p className="text-xs text-gray-400">Fans</p></div>
        </div>
        
        {/* MODIFIED: Level removed, VIP pushed to the right */}
        <div className="flex items-center justify-end text-sm my-4">
             <div onClick={() => onNavigate('vip')} className="flex items-center gap-2 cursor-pointer">
                <span className="font-bold text-yellow-400">VIP {displayedUser.vipLevel}</span>
             </div>
        </div>

        {/* NEW: Wallets section with two boxes */}
        {isMyProfile && (
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div onClick={() => setIsPurchaseModalOpen(true)} className="bg-black/50 border border-purple-800 rounded-lg p-3 text-center cursor-pointer">
                    <p className="font-bold text-yellow-400 text-lg">{currentUser.coins.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Coins</p>
                </div>
                 <div onClick={() => onNavigate('points')} className="bg-black/50 border border-purple-800 rounded-lg p-3 text-center cursor-pointer">
                    <p className="font-bold text-green-400 text-lg">{currentUser.points.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Withdrawal</p>
                </div>
            </div>
        )}
        
        {/* Main Icon Grid */}
        <div className="bg-black/50 border border-purple-800 rounded-lg p-4 mb-4">
          <ProfileIconGrid items={mainGridItems} onNavigate={handleGridNavigate} />
        </div>
        
        {/* Secondary Icon Grid */}
        <div className="bg-black/50 border border-purple-800 rounded-lg p-4">
          <ProfileIconGrid items={secondaryGridItems} onNavigate={onNavigate} />
        </div>

      </div>

      {isMyProfile && isPurchaseModalOpen && <PurchaseCoinsModal onPurchase={handlePurchaseCoins} onClose={() => setIsPurchaseModalOpen(false)} />}
      {isMyProfile && isWithdrawModalOpen && <WithdrawalModal user={currentUser} onClose={() => setIsWithdrawModalOpen(false)} setUser={setUser} showToast={showToast} />}
      {isMyProfile && isEditModalOpen && <EditProfileModal user={currentUser} onClose={() => setIsEditModalOpen(false)} setUser={setUser} />}
    </div>
  );
};

export default ProfileScreen;