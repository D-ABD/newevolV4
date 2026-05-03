import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Flame, Target, Calendar } from 'lucide-react';
import type { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>) => void;
  onCompleteHabit: (habitId: string) => void;
}

export function HabitTracker({ habits, onAddHabit, onCompleteHabit }: HabitTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily' as const,
    target: 1,
    current: 0,
    streak: 0,
    color: 'blue',
    icon: '💪'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHabit(newHabit);
    setNewHabit({
      name: '',
      description: '',
      category: 'health',
      frequency: 'daily',
      target: 1,
      current: 0,
      streak: 0,
      color: 'blue',
      icon: '💪'
    });
    setShowForm(false);
  };

  const getTodayProgress = (habit: Habit) => {
    const today = new Date().toDateString();
    const todayCompleted = habit.completedDates.some(date => 
      new Date(date).toDateString() === today
    );
    return todayCompleted;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Target className="w-6 h-6 mr-2 text-purple-500" />
          Suivi des Habitudes
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle habitude
        </motion.button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded-lg bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom de l'habitude"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className="p-2 border rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              className="p-2 border rounded-md"
            />
            <select
              value={newHabit.frequency}
              onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
              className="p-2 border rounded-md"
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
            <input
              type="number"
              placeholder="Objectif"
              value={newHabit.target}
              onChange={(e) => setNewHabit({ ...newHabit, target: Number(e.target.value) })}
              className="p-2 border rounded-md"
              min="1"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Ajouter
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4">
        {habits.map((habit) => {
          const isCompletedToday = getTodayProgress(habit);
          const progressPercentage = (habit.current / habit.target) * 100;

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`border rounded-lg p-4 ${isCompletedToday ? 'bg-green-50 border-green-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{habit.icon}</span>
                  <div>
                    <h4 className="font-medium">{habit.name}</h4>
                    <p className="text-sm text-gray-500">{habit.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{habit.streak} jours</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onCompleteHabit(habit.id)}
                    disabled={isCompletedToday}
                    className={`p-2 rounded-full ${
                      isCompletedToday
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-green-500 hover:text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${habit.color}-500 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-600">
                  <span>{habit.current} / {habit.target}</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}