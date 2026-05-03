import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as api from '../services/api';
import type { CalendarEntry } from '../types';

interface VisualCalendarProps {
  year?: number;
  month?: number;
}

export const VisualCalendar: React.FC<VisualCalendarProps> = ({ year, month }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedYear = year || currentDate.getFullYear();
  const selectedMonth = month !== undefined ? month : currentDate.getMonth() + 1;

  useEffect(() => {
    loadCalendarData();
  }, [selectedYear, selectedMonth]);

  const loadCalendarData = async () => {
    setIsLoading(true);
    try {
      const entries = await api.getCalendarEntries(selectedYear, selectedMonth);
      setCalendarEntries(entries);
    } catch (error) {
      console.error('Erreur lors du chargement du calendrier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEntryForDate = (date: Date): CalendarEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return calendarEntries.find(entry => entry.date === dateStr);
  };

  const getMoodColor = (mood: number): string => {
    if (mood >= 8) return 'bg-green-500';
    if (mood >= 6) return 'bg-lime-500';
    if (mood >= 4) return 'bg-yellow-500';
    if (mood >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(selectedYear, selectedMonth - 1 + direction, 1));
  };

  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth - 1));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {format(monthStart, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          →
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const entry = getEntryForDate(day);
              const hasEntry = entry && entry.entryCount > 0;
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`
                    aspect-square p-1 rounded-lg relative
                    ${!isSameMonth(day, monthStart) ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-700'}
                    ${isToday(day) ? 'ring-2 ring-blue-500' : ''}
                    hover:shadow-md transition-shadow cursor-pointer
                  `}
                >
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {format(day, 'd')}
                  </div>
                  
                  {hasEntry && (
                    <div className="space-y-1">
                      <div className={`h-2 rounded-full ${getMoodColor(entry.averageMood)}`} />
                      <div className="text-[10px] text-gray-600 dark:text-gray-400 text-center">
                        {entry.entryCount} entrées
                      </div>
                      {entry.streakDay && (
                        <div className="text-[10px] text-orange-500 text-center">🔥</div>
                      )}
                    </div>
                  )}
                  
                  {!hasEntry && isSameMonth(day, monthStart) && (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                      -
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Excellent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-lime-500"></div>
              <span>Bien</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Moyen</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Bas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Faible</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
