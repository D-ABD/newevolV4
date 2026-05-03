export interface Entry {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  mood: number;
  tags?: string[];
  imageUrl?: string;
  isPublic?: boolean;
  likes?: number;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  custom?: boolean;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  avatar?: string;
  bio?: string;
  level: number;
  experience: number;
  streakDays: number;
  badges: Badge[];
  theme: 'light' | 'dark';
  weeklyGoals: WeeklyGoal[];
  notifications: boolean;
  reminderTime?: string;
  achievements?: Achievement[];
  friends?: string[];
  notificationPreferences?: NotificationPreferences;
  joinDate: Date;
}

export interface NotificationPreferences {
  dailyReminder: boolean;
  weeklyRecap: boolean;
  achievementAlerts: boolean;
  friendActivity: boolean;
  reminderTime: string;
  quietHours: {
    start: string;
    end: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completedDate?: Date;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface WeeklyGoal {
  id: string;
  category: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  participants: number;
  target: number;
  progress: number;
  joined: boolean;
  startDate?: Date;
  endDate?: Date;
  reward?: {
    type: 'badge' | 'points' | 'achievement';
    value: string | number;
  };
}

export interface Reminder {
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'custom';
  message: string;
  time: string;
  days: number[];
  active: boolean;
  lastTriggered?: Date;
}

export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  streakDays: number;
  status: 'online' | 'offline';
  lastActivity: Date;
}

export interface SharedEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  category: string;
  timestamp: Date;
  mood: number;
  likes: number;
  comments: Comment[];
  tags?: string[];
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  streak: number;
  color: string;
  icon: string;
  createdAt: Date;
  completedDates: Date[];
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export interface Analytics {
  totalEntries: number;
  averageMood: number;
  longestStreak: number;
  currentStreak: number;
  categoriesDistribution: { [key: string]: number };
  moodTrend: number;
  weeklyProgress: number;
  monthlyProgress: number;
}