import React from 'react';
import { Trophy, Star, Clock } from 'lucide-react';
import type { Challenge } from '../types';

interface ChallengesProps {
  challenges: Challenge[];
  onJoinChallenge: (challengeId: string) => void;
}

export function Challenges({ challenges, onJoinChallenge }: ChallengesProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Trophy className="w-6 h-6 mr-2 text-purple-500" />
        Défis communautaires
      </h3>

      <div className="grid gap-4">
        {challenges.map(challenge => (
          <div
            key={challenge.id}
            className={`border rounded-lg p-4 ${
              challenge.joined ? 'bg-purple-50 border-purple-200' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-lg">{challenge.title}</h4>
                <p className="text-gray-600 mt-1">{challenge.description}</p>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {challenge.duration} jours
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {challenge.participants} participants
                  </div>
                </div>
              </div>

              <button
                onClick={() => onJoinChallenge(challenge.id)}
                className={`px-4 py-2 rounded-lg ${
                  challenge.joined
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                }`}
              >
                {challenge.joined ? 'En cours' : 'Rejoindre'}
              </button>
            </div>

            {challenge.joined && (
              <div className="mt-4">
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-sm text-gray-600">
                  <span>Progression: {challenge.progress}/{challenge.target}</span>
                  <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}