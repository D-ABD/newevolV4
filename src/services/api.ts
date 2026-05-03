import axios from 'axios';
import type { 
  Entry, Category, Badge, WeeklyGoal, User, Achievement, 
  NotificationPreferences, Challenge, Habit, SharedEntry, 
  Analytics as AnalyticsType, Comment 
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Helper pour convertir les dates depuis le format ISO
const parseDate = (dateString: string | null): Date => {
  if (!dateString) return new Date();
  return new Date(dateString);
};

// Helper pour formater les dates vers le format ISO
const formatDate = (date: Date): string => {
  return date.toISOString();
};

// ==================== ENTRIES ====================

export const getEntries = async (): Promise<Entry[]> => {
  const response = await api.get('/entries/');
  return response.data.map((entry: any) => ({
    id: entry.id.toString(),
    content: entry.content,
    category: entry.category?.id || entry.category,
    timestamp: parseDate(entry.timestamp),
    mood: entry.mood,
    tags: entry.tags || [],
    imageUrl: entry.image_url,
    isPublic: entry.is_public,
    likes: entry.likes || 0,
    comments: entry.comments?.map((c: any) => ({
      id: c.id.toString(),
      userId: c.user?.id?.toString() || c.user_id,
      userName: c.user?.username || 'Utilisateur',
      content: c.content,
      timestamp: parseDate(c.timestamp),
    })) || [],
  }));
};

export const createEntry = async (entryData: { content: string; category: string; mood: number; tags?: string[]; isPublic?: boolean }): Promise<Entry> => {
  const response = await api.post('/entries/', {
    content: entryData.content,
    category: entryData.category,
    mood: entryData.mood,
    tags: entryData.tags || [],
    is_public: entryData.isPublic || false,
  });
  
  const entry = response.data;
  return {
    id: entry.id.toString(),
    content: entry.content,
    category: entry.category?.id || entry.category,
    timestamp: parseDate(entry.timestamp),
    mood: entry.mood,
    tags: entry.tags || [],
    imageUrl: entry.image_url,
    isPublic: entry.is_public,
    likes: entry.likes || 0,
    comments: [],
  };
};

export const updateEntry = async (id: string, entryData: Partial<Entry>): Promise<Entry> => {
  const response = await api.patch(`/entries/${id}/`, {
    content: entryData.content,
    mood: entryData.mood,
    is_public: entryData.isPublic,
  });
  
  const entry = response.data;
  return {
    id: entry.id.toString(),
    content: entry.content,
    category: entry.category?.id || entry.category,
    timestamp: parseDate(entry.timestamp),
    mood: entry.mood,
    tags: entry.tags || [],
    imageUrl: entry.image_url,
    isPublic: entry.is_public,
    likes: entry.likes || 0,
    comments: entry.comments?.map((c: any) => ({
      id: c.id.toString(),
      userId: c.user?.id?.toString() || c.user_id,
      userName: c.user?.username || 'Utilisateur',
      content: c.content,
      timestamp: parseDate(c.timestamp),
    })) || [],
  };
};

export const deleteEntry = async (id: string): Promise<void> => {
  await api.delete(`/entries/${id}/`);
};

// ==================== CATEGORIES ====================

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories/');
  return response.data.map((cat: any) => ({
    id: cat.id.toString(),
    name: cat.name,
    icon: cat.icon || 'folder',
    color: cat.color || 'blue',
    custom: cat.custom || false,
  }));
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
  const response = await api.post('/categories/', {
    name: categoryData.name,
    icon: categoryData.icon,
    color: categoryData.color,
  });
  
  const cat = response.data;
  return {
    id: cat.id.toString(),
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    custom: true,
  };
};

// ==================== USER & PROFILE ====================

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/profile/me/');
  const profile = response.data;
  
  return {
    id: profile.user?.id?.toString() || profile.id?.toString() || '1',
    username: profile.user?.username || profile.username || 'Utilisateur',
    email: profile.user?.email || profile.email || '',
    avatar: profile.avatar,
    bio: profile.bio,
    level: profile.level || 1,
    experience: profile.experience || 0,
    streakDays: profile.streak_days || 0,
    badges: profile.badges?.map((b: any) => ({
      id: b.id?.toString() || b.name?.toLowerCase(),
      name: b.name,
      description: b.description,
      icon: b.icon || '🏆',
      earned: b.earned || false,
      earnedDate: b.earned_date ? parseDate(b.earned_date) : undefined,
    })) || [],
    theme: profile.theme || 'light',
    weeklyGoals: profile.weekly_goals?.map((g: any) => ({
      id: g.id?.toString(),
      category: g.category,
      target: g.target,
      current: g.current,
      completed: g.completed,
    })) || [],
    notifications: profile.notifications ?? true,
    reminderTime: profile.reminder_time,
    joinDate: profile.join_date ? parseDate(profile.join_date) : new Date(),
  };
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  const response = await api.patch('/profile/me/', {
    bio: profileData.bio,
    theme: profileData.theme,
    notifications: profileData.notifications,
    reminder_time: profileData.reminderTime,
  });
  
  return getUserProfile();
};

// ==================== BADGES ====================

export const getBadges = async (): Promise<Badge[]> => {
  const response = await api.get('/badges/');
  return response.data.map((badge: any) => ({
    id: badge.id?.toString() || badge.name?.toLowerCase(),
    name: badge.name,
    description: badge.description,
    icon: badge.icon || '🏆',
    earned: badge.earned || false,
    earnedDate: badge.earned_date ? parseDate(badge.earned_date) : undefined,
  }));
};

// ==================== WEEKLY GOALS ====================

export const getWeeklyGoals = async (): Promise<WeeklyGoal[]> => {
  const response = await api.get('/weekly-goals/');
  return response.data.map((goal: any) => ({
    id: goal.id?.toString(),
    category: goal.category,
    target: goal.target,
    current: goal.current,
    completed: goal.completed,
  }));
};

export const updateWeeklyGoal = async (id: string, goalData: Partial<WeeklyGoal>): Promise<WeeklyGoal> => {
  const response = await api.patch(`/weekly-goals/${id}/`, goalData);
  return {
    id: response.data.id?.toString(),
    category: response.data.category,
    target: response.data.target,
    current: response.data.current,
    completed: response.data.completed,
  };
};

// ==================== ACHIEVEMENTS ====================

export const getAchievements = async (): Promise<Achievement[]> => {
  const response = await api.get('/achievements/');
  return response.data.map((achievement: any) => ({
    id: achievement.id?.toString(),
    name: achievement.name,
    description: achievement.description,
    progress: achievement.progress,
    target: achievement.target,
    completedDate: achievement.completed_date ? parseDate(achievement.completed_date) : undefined,
    category: achievement.category,
  }));
};

// ==================== CHALLENGES ====================

export const getChallenges = async (): Promise<Challenge[]> => {
  const response = await api.get('/challenges/');
  return response.data.map((challenge: any) => ({
    id: challenge.id?.toString(),
    title: challenge.title,
    description: challenge.description,
    duration: challenge.duration,
    participants: challenge.participants,
    target: challenge.target,
    progress: challenge.progress,
    joined: challenge.joined,
    startDate: challenge.start_date ? parseDate(challenge.start_date) : undefined,
    endDate: challenge.end_date ? parseDate(challenge.end_date) : undefined,
    reward: challenge.reward,
  }));
};

export const joinChallenge = async (id: string): Promise<Challenge> => {
  const response = await api.post(`/challenges/${id}/join/`);
  return {
    id: response.data.id?.toString(),
    title: response.data.title,
    description: response.data.description,
    duration: response.data.duration,
    participants: response.data.participants,
    target: response.data.target,
    progress: response.data.progress,
    joined: response.data.joined,
  };
};

// ==================== HABITS ====================

export const getHabits = async (): Promise<Habit[]> => {
  const response = await api.get('/habits/');
  return response.data.map((habit: any) => ({
    id: habit.id?.toString(),
    name: habit.name,
    description: habit.description,
    category: habit.category,
    frequency: habit.frequency,
    target: habit.target,
    current: habit.current,
    streak: habit.streak,
    color: habit.color,
    icon: habit.icon,
    createdAt: parseDate(habit.created_at),
    completedDates: habit.completed_dates?.map((d: string) => parseDate(d)) || [],
  }));
};

export const createHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>): Promise<Habit> => {
  const response = await api.post('/habits/', {
    name: habitData.name,
    description: habitData.description,
    category: habitData.category,
    frequency: habitData.frequency,
    target: habitData.target,
    color: habitData.color,
    icon: habitData.icon,
  });
  
  const habit = response.data;
  return {
    id: habit.id?.toString(),
    name: habit.name,
    description: habit.description,
    category: habit.category,
    frequency: habit.frequency,
    target: habit.target,
    current: habit.current,
    streak: habit.streak,
    color: habit.color,
    icon: habit.icon,
    createdAt: parseDate(habit.created_at),
    completedDates: [],
  };
};

export const completeHabit = async (id: string): Promise<Habit> => {
  const response = await api.post(`/habits/${id}/complete/`);
  return {
    id: response.data.id?.toString(),
    name: response.data.name,
    description: response.data.description,
    category: response.data.category,
    frequency: response.data.frequency,
    target: response.data.target,
    current: response.data.current,
    streak: response.data.streak,
    color: response.data.color,
    icon: response.data.icon,
    createdAt: parseDate(response.data.created_at),
    completedDates: response.data.completed_dates?.map((d: string) => parseDate(d)) || [],
  };
};

// ==================== ANALYTICS ====================

export const getAnalytics = async (): Promise<AnalyticsType> => {
  const response = await api.get('/analytics/');
  const data = response.data;
  
  return {
    totalEntries: data.total_entries || 0,
    averageMood: data.average_mood || 0,
    longestStreak: data.longest_streak || 0,
    currentStreak: data.current_streak || 0,
    categoriesDistribution: data.categories_distribution || {},
    moodTrend: data.mood_trend || 0,
    weeklyProgress: data.weekly_progress || 0,
    monthlyProgress: data.monthly_progress || 0,
  };
};

// ==================== COMMUNITY FEED ====================

export const getCommunityFeed = async (): Promise<SharedEntry[]> => {
  const response = await api.get('/entries/public/');
  return response.data.map((entry: any) => ({
    id: entry.id?.toString(),
    userId: entry.user?.id?.toString() || entry.user_id,
    userName: entry.user?.username || 'Utilisateur',
    userAvatar: entry.user?.avatar,
    content: entry.content,
    category: entry.category?.id || entry.category,
    timestamp: parseDate(entry.timestamp),
    mood: entry.mood,
    likes: entry.likes || 0,
    comments: entry.comments?.map((c: any) => ({
      id: c.id?.toString(),
      userId: c.user?.id?.toString() || c.user_id,
      userName: c.user?.username || 'Utilisateur',
      content: c.content,
      timestamp: parseDate(c.timestamp),
    })) || [],
    tags: entry.tags || [],
  }));
};

// ==================== QUOTE OF THE DAY ====================

export const getQuoteOfTheDay = async () => {
  const response = await api.get('/quotes/daily/');
  return {
    id: response.data.id?.toString(),
    text: response.data.text,
    author: response.data.author,
    category: response.data.category,
  };
};

// ==================== AUTHENTICATION ====================

export const login = async (username: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await api.post('/auth/login/', { username, password });
  const token = response.data.token;
  
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  
  const user = await getUserProfile();
  return { token, user };
};

export const register = async (username: string, email: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await api.post('/auth/register/', { username, email, password });
  const token = response.data.token;
  
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  
  const user = await getUserProfile();
  return { token, user };
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

// ==================== NOTIFICATIONS ====================

export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  const response = await api.get('/profile/me/');
  const profile = response.data;
  
  return {
    dailyReminder: profile.daily_reminder ?? true,
    weeklyRecap: profile.weekly_recap ?? true,
    achievementAlerts: profile.achievement_alerts ?? true,
    friendActivity: profile.friend_activity ?? true,
    reminderTime: profile.reminder_time || '20:00',
    quietHours: profile.quiet_hours || { start: '22:00', end: '07:00' },
  };
};

export const updateNotificationPreferences = async (prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
  const response = await api.patch('/profile/me/', {
    daily_reminder: prefs.dailyReminder,
    weekly_recap: prefs.weeklyRecap,
    achievement_alerts: prefs.achievementAlerts,
    friend_activity: prefs.friendActivity,
    reminder_time: prefs.reminderTime,
    quiet_hours: prefs.quietHours,
  });
  
  return getNotificationPreferences();
};

// ==================== EXPORT DATA ====================

export const exportData = async (): Promise<Blob> => {
  const response = await api.get('/export/', {
    responseType: 'blob',
  });
  return response.data;
};
