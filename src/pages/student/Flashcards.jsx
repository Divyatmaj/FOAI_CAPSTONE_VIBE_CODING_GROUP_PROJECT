import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Layers, BookmarkCheck } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import { parseJSON } from '../../utils/parseAI';
import toast from 'react-hot-toast';
import FlashCardGrid from '../../components/flashcards/FlashCardGrid';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Flashcards = () => {
  const store = useAppStore();
  const { flashcards, setFlashcards, cardsStudied, bookmarked } = store;
  const { generate, loading } = useAI();
  const [filter, setFilter] = useState('all');

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
  };

  const handleGenerateNew = async () => {
    if (!store.subject) { toast.error('Setup your subject first.'); return; }
    const text = await generate(
      `Generate exactly 12 flashcards for "${store.chapter || store.subject}" at ${store.level} level.\nReturn ONLY a JSON array: [{"q":"...","a":"...","hint":"...","topic":"...","difficulty":"easy|medium|hard"}]`,
      '', 'flashcards'
    );
    const q = parseJSON(text, []);
    if (q.length) { setFlashcards(q.map((c, i) => ({ ...c, id: i }))); toast.success('Flashcards ready!'); }
    else toast.error('Could not parse flashcards.');
  };

  const displayed = filter === 'bookmarked'
    ? flashcards.filter((_, i) => bookmarked.includes(i))
    : flashcards;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Flashcards</h1>
          <p className="text-gray-400 text-sm mt-1">Click a card to flip · Bookmark your tricky ones</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="accent">{cardsStudied} / {flashcards.length} studied</Badge>
          <Button variant="ghost" size="sm" onClick={handleGenerateNew} loading={loading}>New Cards</Button>
          <Button variant="ghost" size="sm" icon={Shuffle} onClick={handleShuffle}>Shuffle</Button>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'bookmarked'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${
              filter === f ? 'bg-accent/10 border-accent text-accent' : 'border-border text-gray-400 hover:border-gray-600'
            }`}>
            {f === 'bookmarked' && <BookmarkCheck size={14} />}
            {f === 'all' ? `All (${flashcards.length})` : `Bookmarked (${bookmarked.length})`}
          </button>
        ))}
      </div>

      {displayed.length > 0 ? (
        <FlashCardGrid cards={displayed} />
      ) : (
        <div className="card text-center py-20 text-gray-500">
          <Layers size={40} className="mx-auto mb-4 opacity-30" />
          <p>{filter === 'bookmarked' ? 'No bookmarked cards yet.' : 'No flashcards generated yet.'}</p>
          <p className="text-sm mt-1">Go to Setup to generate flashcards.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Flashcards;
