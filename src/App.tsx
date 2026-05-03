import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { Header } from './components/Header';
import { EntryForm } from './components/EntryForm';
import { EntriesList } from './components/EntriesList';
import { Statistics } from './components/Statistics';
import { WeeklyGoals } from './components/WeeklyGoals';
import { Badges } from './components/Badges';
import { CategoryManager } from './components/CategoryManager';
import { LongTermProgress } from './components/LongTermProgress';
import { NotificationSettings } from './components/NotificationSettings';
import { MoodTracker } from './components/MoodTracker';
import { Challenges } from './components/Challenges';
import { UserProfile } from './components/UserProfile';
import { HabitTracker } from './components/HabitTracker';
import { CommunityFeed } from './components/CommunityFeed';
import { Analytics } from './components/Analytics';
import { QuoteOfTheDay } from './components/QuoteOfTheDay';
import { ExportData } from './components/ExportData';
import { AuthForm } from './components/AuthForm';
import type { Entry, Category, Badge, WeeklyGoal, User, Achievement, NotificationPreferences, Challenge } from './types';
import type { Habit, SharedEntry, Analytics as AnalyticsType } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as api from './services/api';

const initialCategories: Category[] = [
  { id: 'physical', name: 'Forme Physique', icon: 'activity', color: 'green' },
  { id: 'mental', name: 'Bien-être Mental', icon: 'heart', color: 'purple' },
  { id: 'social', name: 'Relations', icon: 'users', color: 'blue' },
  { id: 'work', name: 'Travail', icon: 'briefcase', color: 'orange' },
];

const initialBadges: Badge[] = [
  {
    id: 'early-bird',
    name: 'Lève-tôt',
    description: 'Ajoutez 5 entrées avant 9h',
    icon: '🌅',
    earned: true,
    earnedDate: new Date('2024-03-10'),
  },
  {
    id: 'consistent',
    name: 'Régulier',
    description: '7 jours consécutifs',
    icon: '📅',
    earned: true,
    earnedDate: new Date('2024-03-12'),
  },
  {
    id: 'achiever',
    name: 'Achiever',
    description: 'Complétez tous vos objectifs hebdomadaires',
    icon: '🏆',
    earned: false,
  },
  {
    id: 'social-butterfly',
    name: 'Papillon Social',
    description: '10 entrées dans la catégorie Relations',
    icon: '🦋',
    earned: false,
  },
];

const initialWeeklyGoals: WeeklyGoal[] = [
  {
    id: '1',
    category: 'physical',
    target: 5,
    current: 3,
    completed: false,
  },
  {
    id: '2',
    category: 'mental',
    target: 3,
    current: 3,
    completed: true,
  },
  {
    id: '3',
    category: 'social',
    target: 4,
    current: 1,
    completed: false,
  },
];

const initialAchievements: Achievement[] = [
  {
    id: '1',
    name: '100 Jours de Progression',
    description: 'Maintenir une série d\'entrées pendant 100 jours',
    progress: 45,
    target: 100,
    category: 'consistency',
  },
  {
    id: '2',
    name: 'Maître du Bien-être',
    description: 'Compléter 50 entrées dans la catégorie Bien-être',
    progress: 30,
    target: 50,
    category: 'mental',
    completedDate: new Date('2024-03-01'),
  },
  {
    id: '3',
    name: 'Expert Social',
    description: 'Partager 25 moments avec la communauté',
    progress: 15,
    target: 25,
    category: 'social',
  },
];

const initialChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Défi Méditation',
    description: 'Méditez 10 minutes chaque jour pendant une semaine',
    duration: 7,
    participants: 128,
    target: 7,
    progress: 3,
    joined: true,
  },
  {
    id: '2',
    title: 'Challenge Gratitude',
    description: 'Notez 3 choses pour lesquelles vous êtes reconnaissant chaque jour',
    duration: 14,
    participants: 256,
    target: 42,
    progress: 0,
    joined: false,
  },
];

const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Méditation',
    description: 'Méditer 10 minutes par jour',
    category: 'mental',
    frequency: 'daily',
    target: 1,
    current: 0,
    streak: 5,
    color: 'purple',
    icon: '🧘',
    createdAt: new Date('2024-03-01'),
    completedDates: []
  },
  {
    id: '2',
    name: 'Exercice',
    description: 'Faire du sport 30 minutes',
    category: 'physical',
    frequency: 'daily',
    target: 1,
    current: 0,
    streak: 3,
    color: 'green',
    icon: '💪',
    createdAt: new Date('2024-03-01'),
    completedDates: []
  }
];

const mockSharedEntries: SharedEntry[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Marie Dubois',
    content: 'Aujourd\'hui j\'ai terminé mon premier marathon ! Une expérience incroyable.',
    category: 'physical',
    timestamp: new Date('2024-03-15'),
    mood: 9,
    likes: 12,
    comments: [
      {
        id: '1',
        userId: '3',
        userName: 'Pierre Martin',
        content: 'Félicitations ! C\'est un exploit formidable !',
        timestamp: new Date('2024-03-15')
      }
    ]
  },
  {
    id: '2',
    userId: '3',
    userName: 'Thomas Leroy',
    content: 'J\'ai enfin réussi à méditer 30 jours consécutifs. La régularité paie !',
    category: 'mental',
    timestamp: new Date('2024-03-14'),
    mood: 8,
    likes: 8,
    comments: []
  }
];

const initialNotificationPreferences: NotificationPreferences = {
  dailyReminder: true,
  weeklyRecap: true,
  achievementAlerts: true,
  friendActivity: true,
  reminderTime: '20:00',
  quietHours: {
    start: '22:00',
    end: '07:00',
  },
};

const mockUser: User = {
  id: '1',
  username: 'Jean Dupont',
  email: 'jean.dupont@example.com',
  level: 5,
  experience: 1250,
  streakDays: 7,
  badges: initialBadges,
  theme: 'light',
  weeklyGoals: initialWeeklyGoals,
  notifications: true,
  reminderTime: '09:00',
  joinDate: new Date('2024-01-01'),
  bio: 'En quête de progression personnelle et de bien-être.',
};

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<'journal' | 'stats' | 'goals' | 'settings'>('journal');
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(initialNotificationPreferences);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [showProfile, setShowProfile] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const isAuthenticated = !!authToken;
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sharedEntries, setSharedEntries] = useState<SharedEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsType>({
    totalEntries: 0,
    averageMood: 0,
    longestStreak: 0,
    currentStreak: 0,
    categoriesDistribution: {},
    moodTrend: 0,
    weeklyProgress: 0,
    monthlyProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données depuis le backend au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Charger les catégories
        try {
          const cats = await api.getCategories();
          if (cats.length > 0) {
            setCategories(cats);
          }
        } catch (error) {
          console.log('Utilisation des catégories par défaut');
        }
        
        // Charger les entrées
        try {
          const fetchedEntries = await api.getEntries();
          setEntries(fetchedEntries);
        } catch (error) {
          console.log('Pas d\'entrées disponibles');
        }
        
        // Charger le profil utilisateur
        try {
          const userProfile = await api.getUserProfile();
          setUser(userProfile);
        } catch (error) {
          console.log('Utilisateur non authentifié ou token invalide');
          api.logout();
          setAuthToken(null);
          setUser(null);
          return;
        }
        
        // Charger les habitudes
        try {
          const fetchedHabits = await api.getHabits();
          if (fetchedHabits.length > 0) {
            setHabits(fetchedHabits);
          }
        } catch (error) {
          setHabits(initialHabits);
        }
        
        // Charger le feed communautaire
        try {
          const feed = await api.getCommunityFeed();
          if (feed.length > 0) {
            setSharedEntries(feed);
          }
        } catch (error) {
          setSharedEntries(mockSharedEntries);
        }
        
        // Charger les défis
        try {
          const fetchedChallenges = await api.getChallenges();
          if (fetchedChallenges.length > 0) {
            setChallenges(fetchedChallenges);
          }
        } catch (error) {
          console.log('Utilisation des défis par défaut');
        }
        
        // Charger les préférences de notification
        try {
          const prefs = await api.getNotificationPreferences();
          setNotificationPreferences(prefs);
        } catch (error) {
          console.log('Utilisation des préférences par défaut');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // Fallback aux données mockées
        setCategories(initialCategories);
        setHabits(initialHabits);
        setSharedEntries(mockSharedEntries);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authToken) {
      setIsLoading(false);
      return;
    }

    loadData();
  }, [authToken]);

  // Sauvegarder dans le localStorage en backup (optionnel)
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('journal_entries', JSON.stringify(entries));
    }
  }, [entries]);

  useEffect(() => {
    if (categories !== initialCategories) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('notification_preferences', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Calcul des analytics
  useEffect(() => {
    const calculateAnalytics = () => {
      const totalEntries = entries.length;
      const averageMood = totalEntries > 0 ? 
        entries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries : 0;
      
      // Calcul de la série actuelle et la plus longue
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      let lastDate: Date | null = null;
      for (const entry of sortedEntries) {
        const entryDate = new Date(entry.timestamp);
        if (!lastDate) {
          tempStreak = 1;
          currentStreak = 1;
        } else {
          const diffDays = Math.floor(
            (lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays === 1) {
            tempStreak++;
            if (lastDate.toDateString() === new Date().toDateString() || 
                lastDate.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
              currentStreak = tempStreak;
            }
          } else if (diffDays > 1) {
            tempStreak = 1;
            if (lastDate.toDateString() !== new Date().toDateString()) {
              currentStreak = 0;
            }
          }
          longestStreak = Math.max(longestStreak, tempStreak);
        }
        lastDate = entryDate;
      }
      
      // Distribution par catégorie
      const categoriesDistribution: { [key: string]: number } = {};
      categories.forEach(cat => {
        categoriesDistribution[cat.id] = entries.filter(e => e.category === cat.id).length;
      });
      
      // Tendance de l'humeur (derniers 7 jours vs 7 jours précédents)
      const now = new Date();
      const last7Days = entries.filter(e => 
        (now.getTime() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24) <= 7
      );
      const previous7Days = entries.filter(e => {
        const daysDiff = (now.getTime() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 7 && daysDiff <= 14;
      });
      
      const recentMood = last7Days.length > 0 ? 
        last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length : 0;
      const previousMood = previous7Days.length > 0 ? 
        previous7Days.reduce((sum, e) => sum + e.mood, 0) / previous7Days.length : 0;
      
      const moodTrend = recentMood - previousMood;
      
      // Progrès hebdomadaire et mensuel
      const thisWeekEntries = entries.filter(e => 
        (now.getTime() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24) <= 7
      ).length;
      const lastWeekEntries = entries.filter(e => {
        const daysDiff = (now.getTime() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 7 && daysDiff <= 14;
      }).length;
      
      const weeklyProgress = lastWeekEntries > 0 ? 
        ((thisWeekEntries - lastWeekEntries) / lastWeekEntries) * 100 : 0;
      
      const monthlyProgress = Math.min((totalEntries / 30) * 100, 100); // Objectif de 30 entrées par mois
      
      setAnalytics({
        totalEntries,
        averageMood,
        longestStreak,
        currentStreak,
        categoriesDistribution,
        moodTrend,
        weeklyProgress,
        monthlyProgress
      });
    };
    
    calculateAnalytics();
  }, [entries, categories]);

  useEffect(() => {
    const lastEntryDate = localStorage.getItem('lastEntryDate');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastEntryDate) {
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff > 1) {
        setUser(prev => ({ ...prev, streakDays: 0 }));
        toast.error('Oh non ! Votre série a été interrompue.', {
          description: 'Ajoutez une entrée aujourd\'hui pour recommencer !',
        });
      }
    }
  }, []);

  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (lastVisit !== today) {
      const greeting = getGreeting();
      toast.success(greeting, {
        duration: 5000,
      });
      localStorage.setItem('lastVisit', today);
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const date = format(new Date(), 'EEEE dd MMMM', { locale: fr });
    
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Bonjour';
    else if (hour < 18) timeGreeting = 'Bon après-midi';
    else timeGreeting = 'Bonsoir';

    return `${timeGreeting} ! Nous sommes le ${date}. Prêt à noter vos réussites ?`;
  };

  const handleNewEntry = async (entryData: { content: string; category: string; mood: number }) => {
    try {
      const newEntry = await api.createEntry({
        content: entryData.content,
        category: entryData.category,
        mood: entryData.mood,
      });
      
      setEntries(prev => [newEntry, ...prev]);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const lastEntryDate = localStorage.getItem('lastEntryDate');
      
      if (!lastEntryDate || lastEntryDate !== today) {
        setUser(prev => prev ? { ...prev, streakDays: prev.streakDays + 1 } : null);
        localStorage.setItem('lastEntryDate', today);
        
        const newStreak = user ? user.streakDays + 1 : 1;
        if (newStreak % 7 === 0) {
          toast.success('🎉 Félicitations !', {
            description: `Vous avez maintenu votre série pendant ${newStreak} jours !`,
          });
        }
      }
      
      // Mettre à jour les objectifs hebdomadaires
      if (user?.weeklyGoals) {
        const updatedGoals = await Promise.all(
          user.weeklyGoals.map(async (goal) => {
            if (goal.category === entryData.category && !goal.completed) {
              const newCurrent = goal.current + 1;
              if (newCurrent >= goal.target) {
                toast.success(`Objectif atteint : ${categories.find(c => c.id === goal.category)?.name} !`);
              }
              return await api.updateWeeklyGoal(goal.id, { current: newCurrent, completed: newCurrent >= goal.target });
            }
            return goal;
          })
        );
        
        setUser(prev => prev ? { ...prev, weeklyGoals: updatedGoals } : null);
      }
      
      toast.success('Moment enregistré !', {
        description: 'Continuez comme ça !',
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'entrée:', error);
      toast.error('Erreur', {
        description: 'Impossible d\'enregistrer le moment. Veuillez réessayer.',
      });
    }
  };

  const checkAchievements = (newEntry: Entry) => {
    const updatedGoals = mockUser.weeklyGoals.map(goal => {
      if (goal.category === newEntry.category && !goal.completed) {
        const newCurrent = goal.current + 1;
        if (newCurrent >= goal.target) {
          toast.success(`Objectif atteint : ${categories.find(c => c.id === goal.category)?.name} !`);
        }
        return { ...goal, current: newCurrent, completed: newCurrent >= goal.target };
      }
      return goal;
    });
    mockUser.weeklyGoals = updatedGoals;

    if (newEntry.timestamp.getHours() < 9) {
      const earlyEntries = entries.filter(e => e.timestamp.getHours() < 9).length;
      if (earlyEntries === 4) {
        const earlyBirdBadge = mockUser.badges.find(b => b.id === 'early-bird');
        if (earlyBirdBadge && !earlyBirdBadge.earned) {
          earlyBirdBadge.earned = true;
          earlyBirdBadge.earnedDate = new Date();
          toast.success('Nouveau badge débloqué : Lève-tôt ! 🌅', {
            duration: 5000,
          });
        }
      }
    }
  };

  const handleTogglePublic = async (entryId: string) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;
      
      const updatedEntry = await api.updateEntry(entryId, { isPublic: !entry.isPublic });
      setEntries(entries.map(e => e.id === entryId ? updatedEntry : e));
      
      if (!entry.isPublic) {
        toast.success('Moment partagé avec la communauté !');
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de partager le moment.',
      });
    }
  };

  const handleLike = async (entryId: string) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;
      
      // Optimistic update
      setEntries(entries.map(e => 
        e.id === entryId ? { ...e, likes: (e.likes || 0) + 1 } : e
      ));
      
      // Note: L'API pourrait ne pas avoir d'endpoint dedicated pour les likes
      // On peut implémenter un patch si nécessaire
    } catch (error) {
      // Revert optimistic update
      setEntries(entries.map(e => 
        e.id === entryId ? { ...e, likes: (e.likes || 0) - 1 } : e
      ));
      console.error('Erreur lors du like:', error);
    }
  };

  const handleComment = async (entryId: string, content: string) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;
      
      // Note: L'API Django a un modèle Comment mais pas d'endpoint direct visible
      // Pour l'instant, on fait une mise à jour optimistic
      const newComment = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        userName: user?.username || 'Utilisateur',
        content,
        timestamp: new Date(),
      };
      
      setEntries(entries.map(e => 
        e.id === entryId 
          ? { ...e, comments: [...(e.comments || []), newComment] }
          : e
      ));
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter le commentaire.',
      });
      console.error('Erreur lors du commentaire:', error);
    }
  };

  const handleAddCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await api.createCategory(category);
      setCategories([...categories, newCategory]);
      toast.success(`Nouvelle catégorie ajoutée : ${newCategory.name}`);
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter la catégorie.',
      });
      console.error('Erreur lors de l\'ajout de catégorie:', error);
    }
  };

  const handleEditCategory = async (id: string, updates: Partial<Category>) => {
    try {
      // Note: L'API n'a pas d'endpoint PATCH pour les catégories visible
      // Mise à jour optimistic
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      ));
      toast.success('Catégorie mise à jour');
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de mettre à jour la catégorie.',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // Note: L'API n'a pas d'endpoint DELETE pour les catégories visible
      // Suppression optimistic
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Catégorie supprimée');
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de supprimer la catégorie.',
      });
    }
  };

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    setAuthToken(localStorage.getItem('auth_token'));
  };

  const handleLogout = () => {
    api.logout();
    setAuthToken(null);
    setUser(null);
    setShowProfile(false);
    toast.success('Déconnexion réussie');
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const updatedChallenge = await api.joinChallenge(challengeId);
      setChallenges(challenges.map(c => 
        c.id === challengeId ? updatedChallenge : c
      ));
      toast.success('Vous avez rejoint le défi !');
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de rejoindre le défi.',
      });
    }
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    try {
      const updatedUser = await api.updateUserProfile(updates);
      setUser(updatedUser);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de mettre à jour le profil.',
      });
    }
  };

  const handleAddHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => {
    try {
      const newHabit = await api.createHabit(habitData);
      setHabits(prev => [...prev, newHabit]);
      toast.success(`Nouvelle habitude ajoutée : ${newHabit.name}`);
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter l\'habitude.',
      });
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    try {
      const updatedHabit = await api.completeHabit(habitId);
      setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
      toast.success(`Habitude "${updatedHabit.name}" complétée !`);
    } catch (error) {
      // Fallback optimistic update
      const today = new Date();
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          const todayString = today.toDateString();
          const alreadyCompleted = habit.completedDates.some(date => 
            new Date(date).toDateString() === todayString
          );
          
          if (!alreadyCompleted) {
            return {
              ...habit,
              current: habit.current + 1,
              streak: habit.streak + 1,
              completedDates: [...habit.completedDates, today]
            };
          }
        }
        return habit;
      }));
      console.error('Erreur lors de la complétion de l\'habitude:', error);
    }
  };

  const handleLikeSharedEntry = async (entryId: string) => {
    try {
      // Optimistic update
      setSharedEntries(prev => prev.map(entry => 
        entry.id === entryId ? { ...entry, likes: entry.likes + 1 } : entry
      ));
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleCommentSharedEntry = async (entryId: string, comment: string) => {
    try {
      // Optimistic update
      const newComment = {
        id: Date.now().toString(),
        userId: user?.id || '1',
        userName: user?.username || 'Vous',
        content: comment,
        timestamp: new Date()
      };
      
      setSharedEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            comments: [...entry.comments, newComment]
          };
        }
        return entry;
      }));
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible d\'ajouter le commentaire.',
      });
    }
  };

  const handleShareEntry = (entryId: string) => {
    toast.success('Entrée partagée avec la communauté !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Toaster position="top-right" />
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : !user ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
          <div className="rounded-xl bg-white p-10 shadow-lg text-center">
            <p className="text-lg font-semibold">Chargement du profil...</p>
          </div>
        </div>
      ) : (
        <>
          <Header user={user} onProfileClick={() => setShowProfile(true)} />
          <main className="max-w-6xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {showProfile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <UserProfile
                user={user}
                onUpdateUser={handleUpdateUser}
                onLogout={() => {
                  handleLogout();
                  setShowProfile(false);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex space-x-4 border-b">
                  <button
                    onClick={() => setActiveTab('journal')}
                    className={`py-2 px-4 ${
                      activeTab === 'journal'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Journal
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`py-2 px-4 ${
                      activeTab === 'stats'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Statistiques
                  </button>
                  <button
                    onClick={() => setActiveTab('goals')}
                    className={`py-2 px-4 ${
                      activeTab === 'goals'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Objectifs
                  </button>
                  <button
                    onClick={() => setActiveTab('community')}
                    className={`py-2 px-4 ${
                      activeTab === 'community'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Communauté
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`py-2 px-4 ${
                      activeTab === 'settings'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Paramètres
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'journal' && (
                    <>
                      <QuoteOfTheDay />
                      <div className="mt-6">
                      <EntryForm onSubmit={handleNewEntry} categories={categories} />
                      </div>
                      <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Vos moments de fierté</h2>
                        <EntriesList
                          entries={entries}
                          categories={categories}
                          onTogglePublic={handleTogglePublic}
                          onLike={handleLike}
                          onComment={handleComment}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'stats' && (
                    <div className="space-y-8">
                      <Analytics entries={entries} categories={categories} analytics={analytics} />
                      <MoodTracker entries={entries} />
                      <LongTermProgress
                        achievements={initialAchievements}
                        entries={entries}
                      />
                    </div>
                  )}

                  {activeTab === 'goals' && (
                    <div className="space-y-8">
                      <WeeklyGoals goals={mockUser.weeklyGoals} categories={categories} />
                      <HabitTracker 
                        habits={habits}
                        onAddHabit={handleAddHabit}
                        onCompleteHabit={handleCompleteHabit}
                      />
                      <Challenges 
                        challenges={challenges}
                        onJoinChallenge={handleJoinChallenge}
                      />
                      <Badges badges={mockUser.badges} />
                    </div>
                  )}

                  {activeTab === 'community' && (
                    <div className="space-y-8">
                      <CommunityFeed
                        entries={sharedEntries}
                        onLike={handleLikeSharedEntry}
                        onComment={handleCommentSharedEntry}
                        onShare={handleShareEntry}
                      />
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-8">
                      <CategoryManager
                        categories={categories}
                        onAddCategory={handleAddCategory}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
                      />
                      <NotificationSettings
                        preferences={notificationPreferences}
                        onUpdate={setNotificationPreferences}
                      />
                      <ExportData entries={entries} categories={categories} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
      )}
    </div>
  );
}

export default App;