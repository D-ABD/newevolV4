import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Users, Filter } from 'lucide-react';
import type { SharedEntry, Comment } from '../types';

interface CommunityFeedProps {
  entries: SharedEntry[];
  onLike: (entryId: string) => void;
  onComment: (entryId: string, comment: string) => void;
  onShare: (entryId: string) => void;
}

export function CommunityFeed({ entries, onLike, onComment, onShare }: CommunityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'friends' | 'trending'>('all');
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const handleComment = (entryId: string) => {
    const comment = newComment[entryId];
    if (comment?.trim()) {
      onComment(entryId, comment);
      setNewComment({ ...newComment, [entryId]: '' });
    }
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😄';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '🙁';
    return '😢';
  };

  const filteredEntries = entries.filter(entry => {
    switch (filter) {
      case 'trending':
        return entry.likes > 5;
      case 'friends':
        return true; // Implement friend logic
      default:
        return true;
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Users className="w-6 h-6 mr-2 text-purple-500" />
          Communauté
        </h3>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">Tous</option>
            <option value="friends">Amis</option>
            <option value="trending">Tendances</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                {entry.userAvatar ? (
                  <img src={entry.userAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  entry.userName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{entry.userName}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()} • {entry.category}
                    </p>
                  </div>
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                </div>
                <p className="mt-2 text-gray-800">{entry.content}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onLike(entry.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                    >
                      <Heart className={`w-5 h-5 ${entry.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{entry.likes}</span>
                    </motion.button>
                    
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                      <MessageCircle className="w-5 h-5" />
                      <span>{entry.comments.length}</span>
                    </button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onShare(entry.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {entry.comments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {entry.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    ))}
                    {entry.comments.length > 2 && (
                      <button className="text-sm text-purple-600 hover:text-purple-700">
                        Voir tous les commentaires ({entry.comments.length})
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ajouter un commentaire..."
                    value={newComment[entry.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [entry.id]: e.target.value })}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(entry.id)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleComment(entry.id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                  >
                    Publier
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}