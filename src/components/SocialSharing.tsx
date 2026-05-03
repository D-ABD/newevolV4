import React, { useState } from 'react';
import { Share2, Heart, MessageCircle, Users } from 'lucide-react';
import type { Entry, Comment } from '../types';

interface SocialSharingProps {
  entry: Entry;
  onTogglePublic: (entryId: string) => void;
  onLike: (entryId: string) => void;
  onComment: (entryId: string, comment: string) => void;
}

export function SocialSharing({ entry, onTogglePublic, onLike, onComment }: SocialSharingProps) {
  const [comment, setComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(entry.id, comment);
      setComment('');
    }
  };

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(entry.id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
          >
            <Heart className={`w-5 h-5 ${entry.likes && entry.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{entry.likes || 0}</span>
          </button>
          
          <button
            onClick={() => onTogglePublic(entry.id)}
            className={`flex items-center space-x-1 ${
              entry.isPublic ? 'text-green-500' : 'text-gray-500'
            }`}
          >
            <Share2 className="w-5 h-5" />
            <span>{entry.isPublic ? 'Public' : 'Privé'}</span>
          </button>
        </div>

        <div className="flex items-center text-gray-500">
          <Users className="w-5 h-5 mr-1" />
          <span>{entry.comments?.length || 0} commentaires</span>
        </div>
      </div>

      {entry.isPublic && (
        <div className="space-y-4">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </form>

          {entry.comments && entry.comments.length > 0 && (
            <div className="space-y-3">
              {entry.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}