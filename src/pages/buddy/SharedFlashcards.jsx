import React from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import FlashCardGrid from '../../components/flashcards/FlashCardGrid';
import Button from '../../components/ui/Button';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const SharedFlashcards = () => {
  const { flashcards, setFlashcards } = useAppStore();
  const handleShuffle = () => setFlashcards([...flashcards].sort(() => Math.random() - 0.5));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Shared Flashcards</h1>
          <p className="text-gray-400 text-sm mt-1">Study together with your buddy's deck</p>
        </div>
        <Button variant="ghost" icon={Shuffle} onClick={handleShuffle}>Shuffle</Button>
      </div>
      {flashcards.length > 0
        ? <FlashCardGrid cards={flashcards} />
        : <div className="card text-center py-20 text-gray-500">No shared flashcards yet. Ask your buddy to share a deck!</div>
      }
    </motion.div>
  );
};

export default SharedFlashcards;
