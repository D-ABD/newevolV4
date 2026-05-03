import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Award, Target, Activity, Smile } from 'lucide-react';
import type { Entry, Category, Analytics as AnalyticsType } from '../types';

interface AnalyticsProps {
  entries: Entry[];
  categories: Category[];
  analytics: AnalyticsType;
}

export function Analytics({ entries, categories, analytics }: AnalyticsProps) {
  const getCategoryData = () => {
    return categories.map(category => ({
      name: category.name,
      value: analytics.categoriesDistribution[category.id] || 0,
      color: category.color
    }));
  };

  const getWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => {
      const dayEntries = entries.filter(entry => 
        new Date(entry.timestamp).toDateString() === date.toDateString()
      );
      return {
        day: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        entries: dayEntries.length,
        mood: dayEntries.length > 0 ? 
          dayEntries.reduce((sum, entry) => sum + entry.mood, 0) / dayEntries.length : 0
      };
    });
  };

  const getMoodDistribution = () => {
    const moodRanges = [
      { range: '1-2', count: 0, color: '#ef4444' },
      { range: '3-4', count: 0, color: '#f59e0b' },
      { range: '5-6', count: 0, color: '#eab308' },
      { range: '7-8', count: 0, color: '#22c55e' },
      { range: '9-10', count: 0, color: '#16a34a' }
    ];

    entries.forEach(entry => {
      if (entry.mood <= 2) moodRanges[0].count++;
      else if (entry.mood <= 4) moodRanges[1].count++;
      else if (entry.mood <= 6) moodRanges[2].count++;
      else if (entry.mood <= 8) moodRanges[3].count++;
      else moodRanges[4].count++;
    });

    return moodRanges;
  };

  const weeklyData = getWeeklyData();
  const categoryData = getCategoryData();
  const moodData = getMoodDistribution();

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Total Entrées</h3>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{analytics.totalEntries}</p>
          <p className="text-sm text-gray-500">+{analytics.weeklyProgress}% cette semaine</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Humeur Moyenne</h3>
            <Smile className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{analytics.averageMood.toFixed(1)}</p>
          <p className="text-sm text-gray-500">
            {analytics.moodTrend > 0 ? '+' : ''}{analytics.moodTrend.toFixed(1)} tendance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Série Actuelle</h3>
            <Activity className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{analytics.currentStreak}</p>
          <p className="text-sm text-gray-500">Record: {analytics.longestStreak} jours</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Progrès Mensuel</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{analytics.monthlyProgress}%</p>
          <p className="text-sm text-gray-500">Objectif mensuel</p>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité hebdomadaire */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Activité de la semaine</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entries" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Répartition par catégorie */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`var(--${entry.color}-500)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Évolution de l'humeur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Évolution de l'humeur</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribution de l'humeur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Distribution de l'humeur</h3>
          <div className="space-y-3">
            {moodData.map((mood, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{mood.range}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(mood.count / entries.length) * 100}%`,
                        backgroundColor: mood.color
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500">{mood.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}