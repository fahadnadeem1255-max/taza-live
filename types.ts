export type RoomType = 'video' | 'audio';

export interface Room {
  id: string;
  title: string;
  host: User;
  coHosts?: User[]; // Added for the new design
  type: RoomType;
  coverImage: string;
  viewers: number;
  participants: User[];
  // New properties for functional room settings
  theme?: string;
  mood?: string;
  seatCapacity?: 5 | 10 | 20 | 40;
  mode?: 'Public' | 'Password' | 'Private';
  password?: string;
  country?: string;
}

// --- NEW Ranking System Types ---
export interface RankingEntry {
  rank: number;
  user: User;
  amount: number;
}

export interface Rankings {
  gifters: {
    daily: RankingEntry[];
    weekly: RankingEntry[];
    monthly: RankingEntry[];
  };
  receivers: {
    daily: RankingEntry[];
    weekly: RankingEntry[];
    monthly: RankingEntry[];
  };
}

// --- NEW User-specific Gifting Stats ---
export interface GiftingStat {
  rank: number;
  user: User;
  amount: number;
}


export interface User {
  id: string;
  name: string; // The short name under the avatar, e.g., "Admin"
  username: string; // The longer name, e.g., "Fahad Admin"
  idNumber: string;
  avatar: string;
  bio: string;
  coins: number;
  points: number; // Represents the "withdrawal" balance
  follow: number;
  friends: number;
  fans: number;
  frameUrl?: string; // The large decorative frame
  vipLevel: number;
  vipBadgeUrl: string; // The small green VIP badge
  level?: number;
  xp?: { current: number; next: number };
  inviteCode?: string;
  beads?: number;
  stars?: number;
  contributions?: {
    daily: GiftingStat[];
    weekly: GiftingStat[];
    monthly: GiftingStat[];
    overall: GiftingStat[];
  };
}

export interface Message {
  id: string;
  user: User;
  type: 'text' | 'image' | 'voice';
  text: string; // For text messages, or a caption for media
  mediaUrl?: string; // For images or voice memo files
  duration?: string; // For voice memos
  timestamp: string;
}

export interface Conversation {
  id: string;
  user: User; // The other user
  messages: Message[];
}


export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
}

export interface Reward {
  id:string;
  title: string;
  description: string;
  coins: number;
  action: 'claim' | 'go';
}

// --- NEW TYPES FOR DYNAMIC WITHDRAWAL ---
export interface PaymentField {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'email';
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'wallet' | 'bank';
  fields: PaymentField[];
}

export interface CountryPaymentOptions {
  country: string;
  methods: PaymentMethod[];
}

// FIX: Define and export the Country interface for use in constants.ts.
export interface Country {
  code: string;
  name: string;
  flag: string;
}


export type View = 
  | 'home' 
  | 'room' 
  | 'inbox' // now notifications
  | 'profile' 
  | 'myRoom'
  | 'hostingCenter'
  | 'agency'
  | 'vip'
  | 'mall'
  | 'feedback'
  | 'liveRecord'
  | 'level'
  | 'myRooms'
  | 'batch' // was badge
  | 'ranking' // Replaces contribution
  | 'reward'
  | 'invite'
  // New views from screenshot
  | 'discover'
  | 'notifications'
  | 'chat' // Added for chat screen
  | 'authority'
  | 'contribution'
  | 'call'
  | 'gameShare'
  | 'settings'
  // Settings Sub-views
  | 'accountAndSecurity'
  | 'privacyPolicy'
  | 'notificationsSettings'
  | 'about'
  | 'language'
  | 'changePhoneNumber'
  | 'resetPassword'
  | 'userAgreement'
  | 'roomSettings' // Added for new screen
  // Room Settings Sub-views
  | 'giftRecord'
  | 'roomManager'
  | 'blockList'
  | 'roomTips'
  | 'points'
  | 'withdraw'
  | 'channel'
  | 'exchange';