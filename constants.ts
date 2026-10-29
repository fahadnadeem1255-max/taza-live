import type { Room, User, Gift, Message, Reward, DailyMission, Conversation, CountryPaymentOptions, Rankings, Country } from './types';

// Asset URLs to match the screenshot
const decorativeFrameUrl = 'https://i.ibb.co/hKBDt5x/photo-frame.png';
const vipBadgeUrl = 'https://i.ibb.co/Cbf3N2x/vip5-badge.png';
const userAvatarUrl = 'https://i.ibb.co/P9M1s1x/profile-pic.jpg';

// --- EXPANDED USER LIST FOR NEW ROOM DESIGN ---
export const allUsers: User[] = [
  { id: 'u1', name: 'Admin', username: 'Fahad Admin', idNumber: '818100', avatar: userAvatarUrl, bio: 'Just here for the vibes ✨. Sharing moments and making friends. Send a gift to say hi!', coins: 184571, points: 515207, follow: 1144, friends: 788, fans: 7554, followers: 7554, following: 1144, followingUserIds: ['u2', 'u3'], blockedUserIds: [], frameUrl: decorativeFrameUrl, vipLevel: 5, vipBadgeUrl: vipBadgeUrl, level: 15, xp: { current: 120, next: 500 }, inviteCode: 'X7F3K9', beads: 13500, stars: 75, checkInStreak: 3, hasCheckedInToday: false },
  { id: 'u2', name: 'Bella', username: 'Bella', idNumber: '123456', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', bio: 'Singing, acoustic covers, and positive energy! 🎶', coins: 1200, points: 500, follow: 1200, friends: 200, fans: 50, followers: 50, following: 1200, vipLevel: 1, vipBadgeUrl: '', beads: 520, stars: 10 },
  { id: 'u3', name: 'Charlie', username: 'Charlie', idNumber: '234567', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', bio: 'Tech enthusiast and nightly DJ set streamer 🎧', coins: 3400, points: 1500, follow: 5600, friends: 300, fans: 80, followers: 80, following: 5600, vipLevel: 2, vipBadgeUrl: '', beads: 1800, stars: 25 },
  { id: 'u4', name: 'Dana', username: 'Dana', idNumber: '345678', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', bio: 'Travel blogger & coffee lover ☕', coins: 800, points: 200, follow: 800, friends: 100, fans: 20, followers: 20, following: 800, vipLevel: 0, vipBadgeUrl: '', beads: 150 },
  { id: 'u5', name: 'Elias', username: 'Elias', idNumber: '456789', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', bio: 'Top rank PK competitor! Always ready for a showdown ⚔️', coins: 9500, points: 25000, follow: 50000, friends: 50, fans: 500, followers: 500, following: 50000, vipLevel: 4, vipBadgeUrl: '', frameUrl: 'https://i.ibb.co/N21yg1p/frame-red-gold.png', beads: 22000, stars: 150 },
  { id: 'u6', name: 'Fiona', username: 'Fiona', idNumber: '567890', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', bio: 'Late night chill audio talk show host 🎙️', coins: 2100, points: 800, follow: 2000, friends: 250, fans: 60, followers: 60, following: 2000, vipLevel: 1, vipBadgeUrl: '', beads: 980, stars: 15 },
  // Add more users for a fuller room
  { id: 'u7', name: 'George', username: 'George', idNumber: '678901', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670ad', bio: 'Gaming streams & retro vibes 🕹️', coins: 500, points: 100, follow: 500, friends: 50, fans: 10, followers: 10, following: 500, vipLevel: 0, vipBadgeUrl: '', beads: 80, frameUrl: 'https://i.ibb.co/wJCMp1M/frame-blue-ice.png', stars: 5 },
  { id: 'u8', name: 'Hanna', username: 'Hanna', idNumber: '789012', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670bd', bio: 'Fashion, dance, and daily lifestyle 💃', coins: 8000, points: 3000, follow: 10000, friends: 400, fans: 200, followers: 200, following: 10000, vipLevel: 3, vipBadgeUrl: '', beads: 3500, stars: 90 },
  { id: 'u9', name: 'Ivan', username: 'Ivan', idNumber: '890123', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670cd', bio: 'Cooking and foodie adventures 🍳', coins: 1500, points: 600, follow: 1500, friends: 150, fans: 40, followers: 40, following: 1500, vipLevel: 1, vipBadgeUrl: '', beads: 750, frameUrl: 'https://i.ibb.co/VvzZg6q/frame-purple-gems.png', stars: 20 },
  { id: 'u10', name: 'Julia', username: 'Julia', idNumber: '901234', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670dd', bio: 'Artist & digital illustration streamer 🎨', coins: 4500, points: 1800, follow: 6000, friends: 350, fans: 120, followers: 120, following: 6000, vipLevel: 2, vipBadgeUrl: '', beads: 2100 },
  { id: 'u11', name: 'Kevin', username: 'Kevin', idNumber: '012345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670ed', bio: '', coins: 300, points: 50, follow: 300, friends: 30, fans: 5, followers: 5, following: 300, vipLevel: 0, vipBadgeUrl: '', beads: 60, stars: 2 },
  { id: 'u12', name: 'Laura', username: 'Laura', idNumber: '112345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670fd', bio: 'Fitness motivation and daily yoga 🧘‍♀️', coins: 6200, points: 2400, follow: 8000, friends: 500, fans: 180, followers: 180, following: 8000, vipLevel: 3, vipBadgeUrl: '', frameUrl: 'https://i.ibb.co/3sXkCwq/frame-astronaut.png', beads: 2900, stars: 60 },
  { id: 'u13', name: 'Mason', username: 'Mason', idNumber: '212345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670gd', bio: '', coins: 1100, points: 400, follow: 1200, friends: 120, fans: 30, followers: 30, following: 1200, vipLevel: 1, vipBadgeUrl: '', beads: 550 },
  { id: 'u14', name: 'Nora', username: 'Nora', idNumber: '312345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670hd', bio: '', coins: 700, points: 250, follow: 900, friends: 90, fans: 25, followers: 25, following: 900, vipLevel: 0, vipBadgeUrl: '', beads: 300, stars: 8 },
  { id: 'u15', name: 'Oscar', username: 'Oscar', idNumber: '412345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670id', bio: 'Top VIP Contributor 🌟 Live event sponsor', coins: 15000, points: 8000, follow: 20000, friends: 800, fans: 1000, followers: 1000, following: 20000, vipLevel: 5, vipBadgeUrl: '', frameUrl: decorativeFrameUrl, beads: 9000, stars: 200 },
  { id: 'u16', name: 'Penny', username: 'Penny', idNumber: '512345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670jd', bio: '', coins: 2800, points: 1100, follow: 3500, friends: 280, fans: 70, followers: 70, following: 3500, vipLevel: 2, vipBadgeUrl: '', beads: 1300 },
  { id: 'u17', name: 'Quinn', username: 'Quinn', idNumber: '612345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670kd', bio: '', coins: 400, points: 120, follow: 450, friends: 45, fans: 15, followers: 15, following: 450, vipLevel: 0, vipBadgeUrl: '', beads: 180 },
  { id: 'u18', name: 'Riley', username: 'Riley', idNumber: '712345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670ld', bio: '', coins: 5300, points: 2100, follow: 7000, friends: 450, fans: 150, followers: 150, following: 7000, vipLevel: 3, vipBadgeUrl: '', beads: 2500, stars: 55 },
  { id: 'u19', name: 'Sam', username: 'Sam', idNumber: '812345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670md', bio: '', coins: 1800, points: 700, follow: 2200, friends: 180, fans: 55, followers: 55, following: 2200, vipLevel: 1, vipBadgeUrl: '', beads: 850, frameUrl: 'https://i.ibb.co/VvzZg6q/frame-purple-gems.png' },
  { id: 'u20', name: 'Tara', username: 'Tara', idNumber: '912345', avatar: 'https://i.pravatar.cc/150?u=a042581f4e2902670nd', bio: '', coins: 900, points: 350, follow: 1100, friends: 110, fans: 35, followers: 35, following: 1100, vipLevel: 0, vipBadgeUrl: '', beads: 400, stars: 9 },
];

allUsers[0].contributions = {
    daily: [
        { rank: 1, user: allUsers[5], amount: 12500 },
        { rank: 2, user: allUsers[15], amount: 9800 },
    ],
    weekly: [
        { rank: 1, user: allUsers[15], amount: 85000 },
        { rank: 2, user: allUsers[5], amount: 76000 },
        { rank: 3, user: allUsers[8], amount: 51000 },
    ],
    monthly: [
        { rank: 1, user: allUsers[15], amount: 320000 },
        { rank: 2, user: allUsers[5], amount: 280000 },
        { rank: 3, user: allUsers[8], amount: 190000 },
    ],
    overall: [
        { rank: 1, user: allUsers[15], amount: 1320000 },
        { rank: 2, user: allUsers[5], amount: 980000 },
        { rank: 3, user: allUsers[8], amount: 690000 },
        { rank: 4, user: allUsers[12], amount: 410000 },
    ]
};
// Add some contributions for another user to test the "other user" view
allUsers[1].contributions = {
    daily: [{ rank: 1, user: allUsers[0], amount: 5000 }],
    weekly: [{ rank: 1, user: allUsers[0], amount: 25000 }, { rank: 2, user: allUsers[10], amount: 15000 }],
    monthly: [{ rank: 1, user: allUsers[0], amount: 100000 }, { rank: 2, user: allUsers[10], amount: 75000 }],
    overall: [{ rank: 1, user: allUsers[0], amount: 250000 }, { rank: 2, user: allUsers[10], amount: 150000 }],
};


export const mockUser: User = allUsers[0];

export const mockRooms: Room[] = [
  { id: 'r1', title: 'Chill Vibes & Lo-fi Beats', host: allUsers[1], type: 'video', coverImage: 'https://picsum.photos/seed/r1/400/300', viewers: 1280, participants: allUsers.slice(0, 4), country: 'United States' },
  { id: 'r2', title: 'Podcast & Chill', host: allUsers[2], type: 'audio', coverImage: 'https://picsum.photos/seed/r2/400/300', viewers: 890, participants: allUsers.slice(5, 15), country: 'Canada' },
  { id: 'r3', title: 'Gaming Marathon!', host: allUsers[4], type: 'video', coverImage: 'https://picsum.photos/seed/r3/400/300', viewers: 2400, participants: allUsers.slice(2, 6), country: 'United Kingdom' },
  { id: 'r4', title: 'Late Night Talk Show', host: allUsers[5], type: 'audio', coverImage: 'https://picsum.photos/seed/r4/400/300', viewers: 1500, participants: allUsers.slice(0, 20), country: 'Canada' },
  { id: 'r5', title: 'Morning Coffee Chat', host: allUsers[3], type: 'video', coverImage: 'https://picsum.photos/seed/r5/400/300', viewers: 450, participants: allUsers.slice(3, 6), country: 'United States' },
];

export const mockGifts: Gift[] = [
  { id: 'g1', name: 'Rose', icon: '🌹', cost: 10 },
  { id: 'g2', name: 'Diamond', icon: '💎', cost: 100 },
  { id: 'g3', name: 'Crown', icon: '👑', cost: 500 },
  { id: 'g4', name: 'Heart', icon: '💖', cost: 50 },
  { id: 'g5', name: 'Rocket', icon: '🚀', cost: 1000 },
  { id: 'g6', name: 'Unicorn', icon: '🦄', cost: 2500 },
  { id: 'g7', name: 'Treasure Ship', icon: '🛳️', cost: 5000 },
  { id: 'g8', name: 'Castle', icon: '🏰', cost: 10000 },
];

export const mockConversations: Conversation[] = [
    {
        id: 'c1',
        user: allUsers[1],
        messages: [
            { id: 'c1m1', user: allUsers[1], type: 'text', text: 'Hey! Are you free tonight?', timestamp: '10:30 AM' },
            { id: 'c1m2', user: mockUser, type: 'text', text: 'Yeah, I think so! What\'s up?', timestamp: '10:31 AM' },
            { id: 'c1m3', user: allUsers[1], type: 'text', text: 'Wanna join my stream later?', timestamp: '10:31 AM' },
            { id: 'c1m4', user: allUsers[1], type: 'image', text: 'Check out this poster!', mediaUrl: 'https://picsum.photos/seed/event/300/200', timestamp: '10:32 AM' },
        ]
    },
    {
        id: 'c2',
        user: allUsers[2],
        messages: [
            { id: 'c2m1', user: allUsers[2], type: 'text', text: 'Loved your stream yesterday!', timestamp: '9:15 AM' }
        ]
    },
    {
        id: 'c3',
        user: allUsers[3],
        messages: [
            { id: 'c3m1', user: allUsers[3], type: 'text', text: 'Sent you a gift!', timestamp: 'Yesterday' }
        ]
    },
    {
        id: 'c4',
        user: allUsers[4],
        messages: [
            { id: 'c4m1', user: allUsers[4], type: 'voice', text: 'Voice message', mediaUrl: '#', duration: '0:15', timestamp: '2 days ago' }
        ]
    },
    {
        id: 'c5',
        user: allUsers[5],
        messages: [
            { id: 'c5m1', user: allUsers[5], type: 'text', text: 'Let\'s collaborate sometime.', timestamp: '2 days ago' },
            { id: 'c5m2', user: mockUser, type: 'text', text: 'Definitely! I\'ll hit you up.', timestamp: '2 days ago' },
        ]
    },
];

export const mockRewards: Reward[] = [
  { id: 'r1', title: 'Daily Check-in', description: 'Get coins for checking in daily', coins: 50, action: 'claim' },
  { id: 'r2', title: 'Stay for 1 hour', description: 'Stay in any room for 1 hour', coins: 100, action: 'go' },
  { id: 'r3', title: 'Share a Post', description: 'Share a post with your friends', coins: 10, action: 'go' },
  { id: 'r4', title: 'Follow Someone', description: 'Follow another user', coins: 5, action: 'go' },
  { id: 'r5', title: 'Send a Big Gift', description: 'Send a gift worth 300 coins', coins: 500, action: 'go' },
];

export const mockDailyMissions: DailyMission[] = [
  {
    id: 'm1',
    title: 'Like 5 profiles',
    description: 'Browse broadcaster profiles and tap the heart icon',
    icon: '❤️',
    rewardCoins: 150,
    currentProgress: 3,
    targetProgress: 5,
    unit: 'likes',
    category: 'social',
    isClaimed: false,
    actionType: 'like_profile',
  },
  {
    id: 'm2',
    title: 'Send a gift',
    description: 'Send any gift (Rose, Diamond, etc.) in a live room',
    icon: '🎁',
    rewardCoins: 300,
    currentProgress: 0,
    targetProgress: 1,
    unit: 'gift',
    category: 'stream',
    isClaimed: false,
    actionType: 'send_gift',
  },
  {
    id: 'm3',
    title: 'Watch streams for 5 mins',
    description: 'Tune into any live video or audio broadcast',
    icon: '📺',
    rewardCoins: 200,
    currentProgress: 5,
    targetProgress: 5,
    unit: 'mins',
    category: 'stream',
    isClaimed: false,
    actionType: 'watch_stream',
  },
  {
    id: 'm4',
    title: 'Follow 2 broadcasters',
    description: 'Follow new creators to expand your feed',
    icon: '👥',
    rewardCoins: 120,
    currentProgress: 1,
    targetProgress: 2,
    unit: 'follows',
    category: 'social',
    isClaimed: false,
    actionType: 'follow_user',
  },
  {
    id: 'm5',
    title: 'Send 3 chat messages',
    description: 'Say hello and interact with friends in room or private chat',
    icon: '💬',
    rewardCoins: 100,
    currentProgress: 2,
    targetProgress: 3,
    unit: 'msgs',
    category: 'activity',
    isClaimed: false,
    actionType: 'send_chat',
  },
  {
    id: 'm6',
    title: 'Share a live stream',
    description: 'Share your favorite live party link with others',
    icon: '🚀',
    rewardCoins: 180,
    currentProgress: 0,
    targetProgress: 1,
    unit: 'shares',
    category: 'social',
    isClaimed: false,
    actionType: 'share_room',
  },
];

// Data for the Mall
const simpleGoldFrame = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbGzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iZ29sZCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PC9zdmc+';
const fireEntryEffect = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeT0iNjUiIHg9IjE1IiBmb250LXNpemU9IjUwIj7wn5iEPC90ZXh0Pjwvc3ZnPg=='; // flame emoji

export const mallItems = [
    { id: 'frame_gold', name: 'Gold Frame', type: 'frame', cost: 2500, value: simpleGoldFrame, preview: simpleGoldFrame },
    { id: 'entry_fire', name: 'Fire Entry', type: 'entry', cost: 5000, value: 'fire', preview: fireEntryEffect },
];

// --- NEW DATA FOR COUNTRY-BASED WITHDRAWAL ---
export const paymentOptionsByCountry: CountryPaymentOptions[] = [
  {
    country: 'Pakistan',
    methods: [
      { id: 'jazzcash', name: 'Jazz Cash', type: 'wallet', fields: [
        { name: 'accountNumber', label: 'Account Number', placeholder: '03xx-xxxxxxx', type: 'text' },
        { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', type: 'text' }
      ]},
      { id: 'easypaisa', name: 'Easy Paisa', type: 'wallet', fields: [
        { name: 'accountNumber', label: 'Account Number', placeholder: '03xx-xxxxxxx', type: 'text' },
        { name: 'accountName', label: 'Account Name', placeholder: 'Full Name', type: 'text' }
      ]},
      { id: 'bank_pk', name: 'Bank Transfer', type: 'bank', fields: [
        { name: 'bankName', label: 'Bank Name', placeholder: 'e.g., HBL, Meezan Bank', type: 'text' },
        { name: 'accountName', label: 'Account Holder Name', placeholder: 'Full Name', type: 'text' },
        { name: 'iban', label: 'IBAN', placeholder: 'PKxx AAAA xxxx xxxx xxxx xxxx', type: 'text' }
      ]},
    ]
  },
  {
    country: 'USA',
    methods: [
      { id: 'paypal', name: 'PayPal', type: 'wallet', fields: [
        { name: 'email', label: 'PayPal Email', placeholder: 'user@example.com', type: 'email' }
      ]},
      { id: 'venmo', name: 'Venmo', type: 'wallet', fields: [
        { name: 'username', label: 'Venmo Username', placeholder: '@username', type: 'text' }
      ]},
      { id: 'bank_us', name: 'ACH Bank Transfer', type: 'bank', fields: [
        { name: 'accountName', label: 'Account Holder Name', placeholder: 'Full Name', type: 'text' },
        { name: 'routingNumber', label: 'Routing Number', placeholder: '9-digit number', type: 'text' },
        { name: 'accountNumber', label: 'Account Number', placeholder: 'Your bank account number', type: 'text' }
      ]},
    ]
  },
  {
    country: 'India',
    methods: [
        { id: 'paytm', name: 'Paytm', type: 'wallet', fields: [
            { name: 'mobileNumber', label: 'Paytm Mobile Number', placeholder: '+91 xxxxxxxxxx', type: 'text' }
        ]},
        { id: 'upi', name: 'UPI', type: 'wallet', fields: [
            { name: 'upiId', label: 'UPI ID', placeholder: 'yourname@okhdfcbank', type: 'text' }
        ]},
    ]
  },
  {
    country: 'United Kingdom',
    methods: [
        { id: 'bank_uk', name: 'Bank Transfer', type: 'bank', fields: [
            { name: 'accountName', label: 'Account Holder Name', placeholder: 'Full Name', type: 'text' },
            { name: 'sortCode', label: 'Sort Code', placeholder: 'xx-xx-xx', type: 'text' },
            { name: 'accountNumber', label: 'Account Number', placeholder: '8-digit number', type: 'text' }
        ]},
    ]
  }
];


// --- NEW GLOBAL RANKING DATA ---
export const mockGlobalRankings: Rankings = {
  gifters: {
    daily: [
      { rank: 1, user: allUsers[5], amount: 12500 },
      { rank: 2, user: allUsers[15], amount: 9800 },
      { rank: 3, user: allUsers[8], amount: 7200 },
    ],
    weekly: [
      { rank: 1, user: allUsers[15], amount: 85000 },
      { rank: 2, user: allUsers[5], amount: 76000 },
      { rank: 3, user: allUsers[8], amount: 51000 },
      { rank: 4, user: allUsers[12], amount: 32000 },
    ],
    monthly: [
      { rank: 1, user: allUsers[15], amount: 320000 },
      { rank: 2, user: allUsers[5], amount: 280000 },
      { rank: 3, user: allUsers[8], amount: 190000 },
      { rank: 4, user: allUsers[12], amount: 110000 },
      { rank: 5, user: allUsers[3], amount: 85000 },
    ]
  },
  receivers: {
    daily: [
      { rank: 1, user: allUsers[0], amount: 15000 },
      { rank: 2, user: allUsers[4], amount: 11500 },
      { rank: 3, user: allUsers[1], amount: 6800 },
    ],
    weekly: [
      { rank: 1, user: allUsers[0], amount: 95000 },
      { rank: 2, user: allUsers[4], amount: 82000 },
      { rank: 3, user: allUsers[1], amount: 61000 },
      { rank: 4, user: allUsers[18], amount: 45000 },
    ],
    monthly: [
      { rank: 1, user: allUsers[0], amount: 410000 },
      { rank: 2, user: allUsers[4], amount: 350000 },
      { rank: 3, user: allUsers[1], amount: 280000 },
      { rank: 4, user: allUsers[18], amount: 210000 },
      { rank: 5, user: allUsers[6], amount: 150000 },
    ]
  }
};

// --- NEW Country List for Login & Filters ---
export const allCountries: Country[] = [
  { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { code: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+385', name: 'Croatia', flag: '🇭🇷' },
  { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { code: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: '+354', name: 'Iceland', flag: '🇮🇸' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
];

export const allCountriesForFilter: { name: string; flag: string }[] = [
  { name: 'Global', flag: '🌍' },
  // Use a Map to ensure unique country names, then sort alphabetically
  ...Array.from(new Map(allCountries.map(c => [c.name, { name: c.name, flag: c.flag }])).values())
    .sort((a, b) => a.name.localeCompare(b.name))
];