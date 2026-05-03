import React from 'react';
import { Target, CheckCircle } from 'lucide-react';
import type { WeeklyGoal, Category } from '../types';

interface WeeklyGoalsProps {
  goals: WeeklyGoal[];
  categories: Category[];
}

export function WeeklyGoals({ goals, categories }: WeeklyGoalsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Objectifs de la semaine</h3>
        <Target className="w-6 h-6 text-purple-500" />
      </div>

      <div className="space-y-4">
        {goals.map(goal => {
          const category = categories.find(c => c.id === goal.category);
          const progress = (goal.current / goal.target) * 100;

          return (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-${category?.color}-500 flex items-center justify-center text-white`}>
                    <span className="text-lg">{category?.icon}</span>
                  </div>
                  <span className="font-medium">{category?.name}</span>
                </div>
                {goal.completed && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`bg-${category?.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <span>{goal.current} / {goal.target} entrées</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}