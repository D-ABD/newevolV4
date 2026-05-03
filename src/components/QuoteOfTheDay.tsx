import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, RefreshCw, Heart } from 'lucide-react';

interface QuoteOfTheDayProps {
  onLike?: () => void;
}

const quotes = [
  {
    text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
    author: "Winston Churchill"
  },
  {
    text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
    author: "Steve Jobs"
  },
  {
    text: "Votre limitation, c'est seulement votre imagination.",
    author: "Anonyme"
  },
  {
    text: "Les grandes choses ne viennent jamais de zones de confort.",
    author: "Anonyme"
  },
  {
    text: "Rêvez-le. Souhaitez-le. Faites-le.",
    author: "Anonyme"
  },
  {
    text: "Le succès commence par la volonté. Si vous voulez réussir, commencez par vouloir.",
    author: "Anonyme"
  },
  {
    text: "Ne regardez pas l'horloge ; faites comme elle. Continuez d'avancer.",
    author: "Sam Levenson"
  },
  {
    text: "La motivation vous fait commencer. L'habitude vous fait continuer.",
    author: "Jim Ryun"
  }
];

export function QuoteOfTheDay({ onLike }: QuoteOfTheDayProps) {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const today = new Date().getDate();
    const quoteIndex = today % quotes.length;
    setCurrentQuote(quotes[quoteIndex]);
  }, []);

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Quote className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-semibold">Citation du jour</h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`p-2 rounded-full ${liked ? 'bg-red-500' : 'bg-white/20'} hover:bg-white/30`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={getNewQuote}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
      
      <motion.blockquote
        key={currentQuote.text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-lg italic mb-3"
      >
        "{currentQuote.text}"
      </motion.blockquote>
      
      <cite className="text-white/80 text-sm">— {currentQuote.author}</cite>
    </motion.div>
  );
}