import React, { useState } from 'react';
import { PenTool, Smile, Tag, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface EntryFormProps {
  onSubmit: (entry: { content: string; category: string; mood: number }) => void;
  categories: Array<{ id: string; name: string; color: string }>;
}

export function EntryForm({ onSubmit, categories }: EntryFormProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [mood, setMood] = useState(5);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({ content, category, mood });
    setContent('');
    setMood(5);
  };

  const handleVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setContent(prev => prev + ' ' + transcript);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    }
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 8) return '😄';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '🙁';
    return '😢';
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="mb-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Qu'avez-vous accompli aujourd'hui ?"
            className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleVoiceRecording}
            className={`absolute right-2 bottom-2 p-2 rounded-full ${
              isRecording ? 'bg-red-500' : 'bg-gray-100'
            } hover:bg-gray-200 transition-colors`}
          >
            <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-500'}`} />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-gray-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded-md p-2"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Smile className="w-5 h-5 text-gray-500" />
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-2xl">{getMoodEmoji(mood)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="ml-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 flex items-center shadow-md"
          disabled={!content.trim()}
        >
          <PenTool className="w-4 h-4 mr-2" />
          Enregistrer
        </motion.button>
      </div>
    </motion.form>
  );
}