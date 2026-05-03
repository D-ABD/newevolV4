import React from 'react';
import { User, Trophy, Star, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  user: {
    level: number;
    experience: number;
    streakDays: number;
  } | null;
  onProfileClick: () => void;
}

export function Header({ user, onProfileClick }: HeaderProps) {
  const userLevel = user?.level ?? 1;
  const userStreakDays = user?.streakDays ?? 0;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold"
          whileHover={{ scale: 1.05 }}
        >
          Journal de Progression
        </motion.h1>
        <div className="flex items-center space-x-6">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
          >
            <Star className="w-5 h-5 mr-2" />
            <span>Niveau {userLevel}</span>
          </motion.div>
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
          >
            <Flame className="w-5 h-5 mr-2 text-orange-300" />
            <span>{userStreakDays} jours</span>
          </motion.div>
          <motion.button
            onClick={onProfileClick}
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
          >
            <User className="w-8 h-8 bg-white/20 rounded-full p-1" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}