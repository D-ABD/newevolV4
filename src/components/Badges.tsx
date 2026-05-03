import React from 'react';
import { Award } from 'lucide-react';
import type { Badge } from '../types';

interface BadgesProps {
  badges: Badge[];
}

export function Badges({ badges }: BadgesProps) {
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Vos badges</h3>
        <Award className="w-6 h-6 text-purple-500" />
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-3">Badges obtenus ({earnedBadges.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {earnedBadges.map(badge => (
              <div
                key={badge.id}
                className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                    <span className="text-xl">{badge.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-medium">{badge.name}</h5>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                  </div>
                </div>
                {badge.earnedDate && (
                  <p className="text-xs text-gray-400 mt-2">
                    Obtenu le {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-3">Badges à débloquer ({unearnedBadges.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {unearnedBadges.map(badge => (
              <div
                key={badge.id}
                className="border rounded-lg p-4 bg-gray-50 opacity-75"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    <span className="text-xl">?</span>
                  </div>
                  <div>
                    <h5 className="font-medium">{badge.name}</h5>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}