import React from 'react';
import { TrendingUp, Calendar, Award } from 'lucide-react';
import type { Achievement, Entry } from '../types';

interface LongTermProgressProps {
  achievements: Achievement[];
  entries: Entry[];
}

export function LongTermProgress({ achievements, entries }: LongTermProgressProps) {
  const getStreakInfo = () => {
    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate: Date | null = null;

    entries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .forEach((entry) => {
        const entryDate = new Date(entry.timestamp);
        if (!lastDate) {
          currentStreak = 1;
          lastDate = entryDate;
        } else {
          const diffDays = Math.floor(
            (lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
          } else if (diffDays > 1) {
            currentStreak = 0;
          }
          lastDate = entryDate;
        }
      });

    return { currentStreak, longestStreak };
  };

  const { currentStreak, longestStreak } = getStreakInfo();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
          Progression à long terme
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-700 font-medium">Série actuelle</span>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-700">{currentStreak} jours</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-700 font-medium">Plus longue série</span>
              <Award className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{longestStreak} jours</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-700 font-medium">Total des entrées</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-700">{entries.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-3">Objectifs à long terme</h4>
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="font-medium text-gray-800">{achievement.name}</h5>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                {achievement.completedDate && (
                  <span className="text-green-500 text-sm">
                    Complété le {new Date(achievement.completedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(achievement.progress / achievement.target) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>{achievement.progress} / {achievement.target}</span>
                <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}