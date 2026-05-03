import React from 'react';
import { BarChart, Calendar, Award, TrendingUp } from 'lucide-react';
import type { Entry, Category } from '../types';

interface StatisticsProps {
  entries: Entry[];
  categories: Category[];
}

export function Statistics({ entries, categories }: StatisticsProps) {
  const getEntriesThisWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return entries.filter(entry => new Date(entry.timestamp) >= startOfWeek);
  };

  const getCategoryStats = () => {
    const stats = categories.map(category => ({
      ...category,
      count: entries.filter(entry => entry.category === category.id).length,
    }));
    return stats.sort((a, b) => b.count - a.count);
  };

  const getAverageMood = () => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  };

  const weeklyEntries = getEntriesThisWeek();
  const categoryStats = getCategoryStats();
  const averageMood = getAverageMood();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Cette semaine</h3>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{weeklyEntries.length}</p>
          <p className="text-sm text-gray-500">entrées</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Total</h3>
            <BarChart className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{entries.length}</p>
          <p className="text-sm text-gray-500">moments enregistrés</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Humeur moyenne</h3>
            <Award className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{averageMood}</p>
          <p className="text-sm text-gray-500">sur 10</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-700">Catégorie favorite</h3>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {categoryStats[0]?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-500">{categoryStats[0]?.count || 0} entrées</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Répartition par catégorie</h3>
        <div className="space-y-4">
          {categoryStats.map(category => (
            <div key={category.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{category.name}</span>
                <span className="text-gray-500">{category.count} entrées</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${category.color}-500 h-2 rounded-full`}
                  style={{
                    width: `${(category.count / entries.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}