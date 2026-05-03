import React from 'react';
import { Clock, Tag } from 'lucide-react';
import { SocialSharing } from './SocialSharing';
import type { Entry, Category } from '../types';

interface EntriesListProps {
  entries: Entry[];
  categories: Category[];
  onTogglePublic?: (entryId: string) => void;
  onLike?: (entryId: string) => void;
  onComment?: (entryId: string, comment: string) => void;
}

export function EntriesList({ 
  entries, 
  categories,
  onTogglePublic = () => {},
  onLike = () => {},
  onComment = () => {},
}: EntriesListProps) {
  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'gray';
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-800">{entry.content}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(entry.timestamp).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className={`text-${getCategoryColor(entry.category)}-600`}>
                    {categories.find(cat => cat.id === entry.category)?.name}
                  </span>
                </div>
              </div>
            </div>
            {entry.mood && (
              <div className={`text-2xl ${entry.mood >= 5 ? 'text-green-500' : 'text-yellow-500'}`}>
                {entry.mood >= 8 ? '😄' : entry.mood >= 5 ? '🙂' : '😐'}
              </div>
            )}
          </div>

          <SocialSharing
            entry={entry}
            onTogglePublic={onTogglePublic}
            onLike={onLike}
            onComment={onComment}
          />
        </div>
      ))}
    </div>
  );
}