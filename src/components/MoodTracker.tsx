import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import type { Entry } from '../types';

interface MoodTrackerProps {
  entries: Entry[];
}

export function MoodTracker({ entries }: MoodTrackerProps) {
  const getMoodData = () => {
    const last30Days = entries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 30)
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        mood: entry.mood
      }))
      .reverse();

    return last30Days;
  };

  const averageMood = entries.reduce((acc, entry) => acc + entry.mood, 0) / entries.length;
  const moodTrend = entries.length >= 2 ? 
    entries[0].mood - entries[entries.length - 1].mood : 
    0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
        Suivi de l'humeur
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-700 font-medium">Humeur moyenne</span>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {averageMood.toFixed(1)} / 10
          </p>
        </div>

        <div className={`bg-${moodTrend >= 0 ? 'green' : 'yellow'}-50 rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-${moodTrend >= 0 ? 'green' : 'yellow'}-700 font-medium`}>
              Tendance
            </span>
            <TrendingUp className={`w-5 h-5 text-${moodTrend >= 0 ? 'green' : 'yellow'}-500`} />
          </div>
          <p className={`text-3xl font-bold text-${moodTrend >= 0 ? 'green' : 'yellow'}-700`}>
            {moodTrend >= 0 ? '+' : ''}{moodTrend.toFixed(1)}
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getMoodData()}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}