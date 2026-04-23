import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { Bookmark, BookmarkCheck, Lightbulb } from 'lucide-react';

const DIFF_VARIANT = { easy: 'success', medium: 'accent', hard: 'danger' };

const FlashCard = ({ card, index, isBookmarked, onBookmark, onStudied }) => {
  const [flipped, setFlipped] = useState(false);
  const [hasStudied, setHasStudied] = useState(false);

  const handleFlip = () => {
    setFlipped((f) => !f);
    if (!hasStudied && !flipped) {
      setHasStudied(true);
      onStudied?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="perspective"
      style={{ height: 220 }}
    >
      <div
        className={`card-inner w-full h-full relative cursor-pointer ${flipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        {/* Front */}
        <div className="card-face card2 absolute inset-0 flex flex-col justify-between rounded-2xl p-5">
          <div className="flex items-start justify-between gap-2">
            <Badge variant={DIFF_VARIANT[card.difficulty] || 'ghost'} className="capitalize">
              {card.difficulty || 'medium'}
            </Badge>
            <button
              onClick={(e) => { e.stopPropagation(); onBookmark?.(); }}
              className="text-slate-400 hover:text-accent transition-colors"
            >
              {isBookmarked ? <BookmarkCheck size={16} className="text-accent" /> : <Bookmark size={16} />}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-center px-2">
            <p className="text-sm font-medium text-slate-900 leading-relaxed">{card.q}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">{card.topic}</span>
            <span className="text-[10px] text-slate-500">Tap to flip</span>
          </div>
        </div>

        {/* Back */}
        <div className="card-face card-back absolute inset-0 bg-accent/5 border border-accent/20 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Lightbulb size={14} />
            <span className="text-xs font-semibold uppercase tracking-wide">Answer</span>
          </div>
          <p className="text-sm text-slate-900 leading-relaxed flex-1 flex items-center">{card.a}</p>
          {card.hint && (
            <p className="text-xs text-slate-600 italic">💡 {card.hint}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FlashCard;
