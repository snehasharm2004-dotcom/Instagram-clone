// Mock Users
const mockUsers = [
  {
    _id: "1",
    username: "john_doe",
    email: "john@example.com",
    password: "123456",
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
    email: "sarah@example.com",
    password: "123456",
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
    email: "alex@example.com",
    password: "123456",
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
    email: "emily@example.com",
    password: "123456",
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
    email: "mike@example.com",
    password: "123456",
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
    imageUrl: "https://loremflickr.com/500/500?lock=1&search=sunset,mountains",
    caption: "Golden hour magic in the mountains ✨ #photography #sunset #mountains",
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
    imageUrl: "https://loremflickr.com/500/500?lock=2&search=coffee,morning",
    caption: "Nothing beats a hot coffee on a beautiful morning ☕ #lifestyle #morning #coffee",
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
    imageUrl: "https://loremflickr.com/500/500?lock=3&search=paris,street,travel",
    caption: "Lost in the charming streets of Paris 🗼 #travel #paris #wanderlust #europe",
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
    imageUrl: "https://loremflickr.com/500/500?lock=4&search=beach,sunset",
    caption: "Pure paradise 🌊 Sunset on the beach is all I need #beach #sunset #vacation #paradise",
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
    imageUrl: "https://loremflickr.com/500/500?lock=5&search=design,ui",
    caption: "Designing beautiful interfaces one pixel at a time 🎨 #design #ui #ux #webdesign",
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
    imageUrl: "https://loremflickr.com/500/500?lock=6&search=pasta,food,cooking",
    caption: "Homemade pasta perfection 🍝 Nothing tastes better than homemade! #foodie #cooking #pasta #delicious",
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
    imageUrl: "https://loremflickr.com/500/500?lock=7&search=breakfast,food",
    caption: "Breakfast goals 🍳 Energy for the day ahead! #breakfast #healthy #food #morningmotivation",
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
    imageUrl: "https://loremflickr.com/500/500?lock=8&search=gym,fitness,workout",
    caption: "Grinding hard at the gym 💪 No pain, no gain! #fitness #workout #fitnessmotivation #gains",
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
  },
  {
    _id: "p9",
    author: mockUsers[1],
    imageUrl: "https://loremflickr.com/500/500?lock=9&search=temple,travel,architecture",
    caption: "Exploring ancient architecture and cultural wonders 🏛️ #travel #architecture #culture #adventure",
    likes: ["0", "2", "3", "4"],
    likesCount: 4,
    comments: [
      {
        _id: "c9",
        author: mockUsers[0],
        text: "Absolutely stunning! When are you going back?",
        likes: []
      },
      {
        _id: "c10",
        author: mockUsers[3],
        text: "This is on my bucket list!",
        likes: []
      }
    ],
    commentsCount: 2,
    location: "Bangkok, Thailand",
    tags: ["travel", "history", "architecture"],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    _id: "p10",
    author: mockUsers[2],
    imageUrl: "https://loremflickr.com/500/500?lock=10&search=design,webdesign,portfolio",
    caption: "Just finished an amazing design project! So proud of this work 🎨 #design #portfolio #creative #webdesign",
    likes: ["0", "1"],
    likesCount: 2,
    comments: [
      {
        _id: "c11",
        author: mockUsers[0],
        text: "Beautiful work! Can't wait to see it live",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Home Office",
    tags: ["design", "webdesign", "portfolio"],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    _id: "p11",
    author: mockUsers[0],
    imageUrl: "https://loremflickr.com/500/500?lock=11&search=photography,nature,golden",
    caption: "Golden hour is photographer's best friend 📷 The perfect light for stunning shots! #photography #nature #golden",
    likes: ["1", "2", "4"],
    likesCount: 3,
    comments: [
      {
        _id: "c12",
        author: mockUsers[1],
        text: "The lighting is perfect!",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Mountain Peak",
    tags: ["photography", "goldenour", "nature"],
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000) // 9 hours ago
  },
  {
    _id: "p12",
    author: mockUsers[3],
    imageUrl: "https://loremflickr.com/500/500?lock=12&search=pizza,food,cooking",
    caption: "Pizza night at home 🍕 Homemade is always better! Fresh, delicious, and made with love #foodie #pizza #cooking",
    likes: ["0", "2", "4"],
    likesCount: 3,
    comments: [
      {
        _id: "c13",
        author: mockUsers[4],
        text: "Recipe please! 😍",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "My Kitchen",
    tags: ["foodie", "homecooking", "pizza"],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    _id: "p13",
    author: mockUsers[4],
    imageUrl: "https://loremflickr.com/500/500?lock=13&search=beach,running,fitness",
    caption: "Morning beach run to energize the soul 🏃 Nothing beats running on sand! #fitness #running #beach #health",
    likes: ["0", "1", "3"],
    likesCount: 3,
    comments: [
      {
        _id: "c14",
        author: mockUsers[0],
        text: "Amazing dedication! Keep it up 💪",
        likes: []
      }
    ],
    commentsCount: 1,
    location: "Sunny Beach",
    tags: ["fitness", "running", "health"],
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000) // 15 hours ago
  },
  {
    _id: "p14",
    author: mockUsers[2],
    imageUrl: "https://loremflickr.com/500/500?lock=14&search=design,branding,creative",
    caption: "Creating a bold new brand identity 🎯 Every color, every shape tells a story! #design #branding #creative #designer",
    likes: ["0", "4"],
    likesCount: 2,
    comments: [
      {
        _id: "c15",
        author: mockUsers[1],
        text: "Can't wait to see the full project!",
        likes: []
      },
      {
        _id: "c16",
        author: mockUsers[3],
        text: "Your work is always so professional",
        likes: []
      }
    ],
    commentsCount: 2,
    location: "Design Studio",
    tags: ["design", "branding", "creative"],
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) // 18 hours ago
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
