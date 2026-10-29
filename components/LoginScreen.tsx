import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { allCountries } from '../constants';

interface LoginScreenProps {
  onLogin: (newUserData?: Partial<User>) => void;
  showToast: (message: string) => void;
}

// --- SVG Icons for the buttons ---
const GoogleIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.222 0-9.641-3.66-11.303-8.334l-6.571 4.819A20 20 0 0 0 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.434 36.316 48 30.659 48 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);
const FacebookIcon = () => (
    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z" />
    </svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);
const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
);


// --- MODAL COMPONENTS for each login flow ---

interface GoogleAccount { name: string; email: string; }
const GoogleModal: React.FC<{ onAccountSelect: (account: GoogleAccount) => void; onClose: () => void; }> = ({ onAccountSelect, onClose }) => {
    const accounts: GoogleAccount[] = [
        { name: 'Fahad Admin', email: 'fahad.admin@gmail.com' },
        { name: 'Gamer Life', email: 'gamer.life@gmail.com' },
        { name: 'Another Account', email: 'another.account@gmail.com' }
    ];
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 relative text-white" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center mb-1">Choose an account</h2>
                <p className="text-sm text-gray-400 text-center mb-6">to continue to Social Live Stream</p>
                <div className="space-y-3">
                    {accounts.map(account => (
                        <button key={account.email} onClick={() => onAccountSelect(account)} className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-purple-600/50">
                            <img src={`https://i.pravatar.cc/150?u=${account.email}`} alt="avatar" className="w-8 h-8 rounded-full mr-3" />
                            <span className="text-sm">{account.email}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface AuthModalProps {
  onAuthAction: (action: 'login' | 'signup') => void;
  onClose: () => void;
  authType: 'phone' | 'email';
  showToast: (message: string) => void;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ onAuthAction, onClose, authType, showToast }) => {
    const [tab, setTab] = useState<'signup' | 'login'>('signup');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [userEnteredCode, setUserEnteredCode] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    
    // State for country code selector
    const [selectedCountry, setSelectedCountry] = useState<Country>(allCountries.find(c => c.code === '+92') || allCountries[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const title = authType === 'phone' ? 'Continue with Phone' : 'Continue with Email';
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (tab === 'login') {
            onAuthAction('login');
            return;
        }

        // Handle sign up flow with verification
        if (!isCodeSent) {
            // Simulate sending a real code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setVerificationCode(code);
            showToast(`Verification code sent!`);
            setInfoMessage(`(For demo) Your code is: ${code}`);
            setIsCodeSent(true);
        } else {
            // This is the final "Sign Up" step after code is entered
            if (userEnteredCode !== verificationCode) {
                showToast('Invalid verification code. Please try again.');
                return;
            }
            onAuthAction('signup');
        }
    };

    const getButtonText = () => {
        if (tab === 'login') return 'Login';
        if (tab === 'signup' && !isCodeSent) return 'Send Code';
        return 'Sign Up';
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 relative text-white" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-center text-pink-400 mb-4">{title}</h2>
                <div className="flex justify-center border-b border-purple-800 mb-6">
                    <button onClick={() => setTab('signup')} className={`px-4 py-2 text-sm font-semibold ${tab === 'signup' ? 'border-b-2 border-pink-500 text-white' : 'text-gray-500'}`}>Sign Up</button>
                    <button onClick={() => setTab('login')} className={`px-4 py-2 text-sm font-semibold ${tab === 'login' ? 'border-b-2 border-pink-500 text-white' : 'text-gray-500'}`}>Login</button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm text-gray-400">{authType === 'phone' ? 'Phone Number' : 'Email Address'}</label>
                        {authType === 'phone' ? (
                            <div className="flex items-center bg-gray-800 border border-purple-800 rounded-lg mt-1">
                                <div className="relative">
                                    <button type="button" onClick={() => setIsDropdownOpen(p => !p)} className="flex items-center p-2 rounded-l-lg hover:bg-gray-700">
                                        <span className="text-lg">{selectedCountry.flag}</span>
                                        <span className="text-sm ml-1">{selectedCountry.code}</span>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute bottom-full mb-2 w-64 bg-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                            {allCountries.map(c => (
                                                <button type="button" key={`${c.name}-${c.code}`} onClick={() => { setSelectedCountry(c); setIsDropdownOpen(false); }} className="w-full flex items-center p-2 hover:bg-purple-600">
                                                    <span className="text-lg">{c.flag}</span>
                                                    <span className="text-sm ml-2 text-left flex-grow">{c.name}</span>
                                                    <span className="text-xs text-gray-400">{c.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input type="tel" placeholder="Your number" className="w-full bg-transparent px-3 py-2" required/>
                            </div>
                        ) : (
                           <input type='email' placeholder='you@example.com' className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1" required/>
                        )}
                    </div>
                    
                    {tab === 'signup' && isCodeSent && (
                        <div>
                            <label className="text-sm text-gray-400">Verification Code</label>
                            <input type="text" value={userEnteredCode} onChange={e => setUserEnteredCode(e.target.value)} placeholder="Enter 6-digit code" className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1" required/>
                            {infoMessage && <p className="text-xs text-cyan-400 mt-2 text-center">{infoMessage}</p>}
                        </div>
                    )}

                    <div>
                        <label className="text-sm text-gray-400">Password</label>
                        <input type="password" placeholder="Enter password" className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1" required/>
                    </div>
                    <button type="submit" className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg">
                        {getButtonText()}
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- NEW PROFILE CREATION COMPONENT ---
const CreateProfile: React.FC<{ onProfileComplete: (data: Partial<User>) => void; prefillData?: Partial<User> | null }> = ({ onProfileComplete, prefillData }) => {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (prefillData) {
            setUsername(prefillData.username || '');
        }
    }, [prefillData]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = () => {
        if (!username || !gender || !dob) {
            alert('Please fill out all required fields.');
            return;
        }
        onProfileComplete({ name: username, username, avatar, bio });
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
            <h1 className="text-3xl font-bold text-pink-400 mb-6">Create Your Profile</h1>
            <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-center">
                    <div className="relative">
                        <img 
                            src={avatar || 'https://i.pravatar.cc/150?u=placeholder'} 
                            alt="Avatar" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
                        />
                        <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Username*</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Gender*</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1 appearance-none">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Prefer not to say</option>
                    </select>
                </div>
                 <div>
                    <label className="text-sm text-gray-400">Date of Birth*</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1"/>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full bg-gray-800 border border-purple-800 rounded-lg px-3 py-2 mt-1" rows={2}></textarea>
                </div>
                <button onClick={handleSubmit} className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg">
                    Complete Sign Up
                </button>
            </div>
        </div>
    );
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, showToast }) => {
  const [modal, setModal] = useState<'google' | 'phone' | 'email' | null>(null);
  const [step, setStep] = useState<'login' | 'profileSetup'>('login');
  const [prefillData, setPrefillData] = useState<Partial<User> | null>(null);


  const closeModal = () => setModal(null);
  
  const handleAuthAction = (action: 'login' | 'signup') => {
    closeModal();
    if (action === 'login') {
      onLogin(); // Existing user logs in
    } else {
      setStep('profileSetup'); // New user starts profile creation
    }
  };

  const handleGoogleSelect = (account: GoogleAccount) => {
    // Assume Google sign-up is always for a new user in this simulation
    closeModal();
    setPrefillData({ name: account.name, username: account.name });
    setStep('profileSetup');
  };

  if (step === 'profileSetup') {
    return <CreateProfile onProfileComplete={onLogin} prefillData={prefillData} />;
  }

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">Welcome</h1>
          <p className="text-gray-400">Join the live party!</p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={() => setModal('google')}
            className="w-full flex items-center justify-center p-3 bg-white text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={() => setModal('email')}
            className="w-full flex items-center justify-center p-3 bg-white text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition-colors"
          >
            <EmailIcon />
            Continue with Email
          </button>
          <button
            onClick={() => setModal('phone')}
            className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition-opacity"
          >
            <PhoneIcon />
            Continue with Phone
          </button>
           <button
            onClick={() => { alert('Facebook login is currently disabled.'); }} // Placeholder action
            className="w-full flex items-center justify-center p-3 bg-gray-600 text-gray-300 rounded-lg font-semibold shadow-md cursor-not-allowed"
          >
            <FacebookIcon />
            Continue with Facebook
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-8 text-center max-w-xs">
          By continuing, you agree to our Terms of Service and acknowledge that you have read our Privacy Policy.
        </p>
      </div>
      
      {modal === 'google' && <GoogleModal onAccountSelect={handleGoogleSelect} onClose={closeModal} />}
      {modal === 'phone' && <AuthModal onAuthAction={handleAuthAction} onClose={closeModal} authType='phone' showToast={showToast} />}
      {modal === 'email' && <AuthModal onAuthAction={handleAuthAction} onClose={closeModal} authType='email' showToast={showToast} />}
    </>
  );
};

export default LoginScreen;
