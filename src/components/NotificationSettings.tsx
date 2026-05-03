import React from 'react';
import { Bell, Clock, Moon, Users } from 'lucide-react';
import type { NotificationPreferences } from '../types';

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onUpdate: (preferences: NotificationPreferences) => void;
}

export function NotificationSettings({ preferences, onUpdate }: NotificationSettingsProps) {
  const handleToggle = (key: keyof NotificationPreferences) => {
    onUpdate({
      ...preferences,
      [key]: !preferences[key as keyof NotificationPreferences],
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-purple-500" />
        Paramètres des notifications
      </h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <h4 className="font-medium">Rappel quotidien</h4>
              <p className="text-sm text-gray-500">Recevez un rappel pour remplir votre journal</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.dailyReminder}
              onChange={() => handleToggle('dailyReminder')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <h4 className="font-medium">Activité des amis</h4>
              <p className="text-sm text-gray-500">Notifications des réussites partagées</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={preferences.friendActivity}
              onChange={() => handleToggle('friendActivity')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-gray-500" />
            <div>
              <h4 className="font-medium">Heures de silence</h4>
              <p className="text-sm text-gray-500">Désactivez les notifications pendant certaines heures</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="time"
              value={preferences.quietHours.start}
              onChange={(e) =>
                onUpdate({
                  ...preferences,
                  quietHours: { ...preferences.quietHours, start: e.target.value },
                })
              }
              className="border rounded p-1 text-sm"
            />
            <span>-</span>
            <input
              type="time"
              value={preferences.quietHours.end}
              onChange={(e) =>
                onUpdate({
                  ...preferences,
                  quietHours: { ...preferences.quietHours, end: e.target.value },
                })
              }
              className="border rounded p-1 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}