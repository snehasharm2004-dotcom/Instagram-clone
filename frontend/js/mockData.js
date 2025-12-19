// Mock Users
const mockUsers = [
  {
    _id: "1",
    username: "john_doe",
    fullName: "John Doe",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    bio: "Photography enthusiast 📸",
    followers: [],
    following: [],
    posts: ["p1", "p2"]
  },
  {
    _id: "2",
    username: "sarah_smith",
    fullName: "Sarah Smith",
    profilePicture: "https://i.pravatar.cc/150?img=2",
    bio: "Travel blogger ✈️",
    followers: [],
    following: [],
    posts: ["p3", "p4"]
  },
  {
    _id: "3",
    username: "alex_jones",
    fullName: "Alex Jones",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    bio: "Designer & developer",
    followers: [],
    following: [],
    posts: ["p5"]
  },
  {
    _id: "4",
    username: "emily_wilson",
    fullName: "Emily Wilson",
    profilePicture: "https://i.pravatar.cc/150?img=4",
    bio: "Food lover 🍕",
    followers: [],
    following: [],
    posts: ["p6", "p7"]
  },
  {
    _id: "5",
    username: "mike_brown",
    fullName: "Mike Brown",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    bio: "Fitness coach 💪",
    followers: [],
    following: [],
    posts: ["p8"]
  }
];

// Mock Posts
const mockPosts = [
  {
    _id: "p1",
    author: mockUsers[0],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop",
    caption: "Beautiful sunset at the mountains! 🌅 #photography #nature #sunset",
    likes: ["2", "3"],
    likesCount: 2,
    comments: [
      {
        _id: "c1",
        author: mockUsers[1],
        text: "Amazing shot! 😍",
        likes: []
      },
      {
        _id: "c2",
        author: mockUsers[2],
        text: "The colors are incredible!",
        likes: []
      }
    ],
    commentsCount: 2,
    location: "Colorado Mountains",
    tags: ["photography", "nature", "sunset"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    _id: "p2",
    author: mockUsers[0],
    imageUrl: "https://images.unsplash.com/photo-1495537821757-a1efb6729352?w=500&h=500&fit=crop",
    caption: "Morning coffee with a view ☕️ #lifestyle #mornings",
    likes: ["1", "4"],
    likesCount: 2,
    comments: [
      {
        _id: "c3",
        author: mockUsers[3],
        text: "I want to be there right now!",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Local Cafe",
    tags: ["lifestyle", "mornings"],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    _id: "p3",
    author: mockUsers[1],
    imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=500&fit=crop",
    caption: "Exploring the streets of Paris 🗼 #travel #wanderlust #paris",
    likes: ["0", "2", "3", "4"],
    likesCount: 4,
    comments: [
      {
        _id: "c4",
        author: mockUsers[0],
        text: "Looks amazing!",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Paris, France",
    tags: ["travel", "wanderlust", "paris"],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    _id: "p4",
    author: mockUsers[1],
    imageUrl: "https://images.unsplash.com/photo-1495562411223-a6b544e408b0?w=500&h=500&fit=crop",
    caption: "Beach vibes 🌊 Nothing beats a sunset on the shore #beach #vacation",
    likes: ["0", "3"],
    likesCount: 2,
    comments: [],
    commentsCount: 0,
    location: "Maldives",
    tags: ["beach", "vacation"],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    _id: "p5",
    author: mockUsers[2],
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop",
    caption: "New UI design system I'm working on 🎨 #design #ux #ui",
    likes: ["0", "1"],
    likesCount: 2,
    comments: [
      {
        _id: "c5",
        author: mockUsers[0],
        text: "This looks incredible! Love the color scheme",
        likes: []
      },
      {
        _id: "c6",
        author: mockUsers[3],
        text: "So clean and modern",
        likes: []
      }
    ],
    commentsCount: 2,
    location: "Design Studio",
    tags: ["design", "ux", "ui"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    _id: "p6",
    author: mockUsers[3],
    imageUrl: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop",
    caption: "This pasta was absolutely delicious! 🍝 Recipe coming soon #foodie #cooking #pasta",
    likes: ["0", "1", "2"],
    likesCount: 3,
    comments: [
      {
        _id: "c7",
        author: mockUsers[4],
        text: "Looks so good! Please share the recipe 😋",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Home Kitchen",
    tags: ["foodie", "cooking", "pasta"],
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000) // 1.5 days ago
  },
  {
    _id: "p7",
    author: mockUsers[3],
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=500&fit=crop",
    caption: "Breakfast vibes ☀️ Start your day right! #breakfast #healthy #morning",
    likes: ["2", "4"],
    likesCount: 2,
    comments: [],
    commentsCount: 0,
    location: "Breakfast Cafe",
    tags: ["breakfast", "healthy", "morning"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    _id: "p8",
    author: mockUsers[4],
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=500&fit=crop",
    caption: "Morning gym session! 💪 Never miss leg day #fitness #workout #health",
    likes: ["0", "1", "3"],
    likesCount: 3,
    comments: [
      {
        _id: "c8",
        author: mockUsers[0],
        text: "Crushing it! 🔥",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Gold's Gym",
    tags: ["fitness", "workout", "health"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  }
];

// Current user (for demo)
const currentUser = {
  _id: "current",
  username: "your_username",
  fullName: "Your Name",
  profilePicture: "https://i.pravatar.cc/150?img=0",
  bio: "Instagram clone demo user",
  followers: mockUsers.slice(0, 3),
  following: mockUsers.slice(1, 4)
};
