import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { RefreshCw, Printer, Star, BookOpen } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Notes = () => {
  const store = useAppStore();
  const { generate, loading } = useAI();
  const [rating, setRating] = useState(store.ratings?.notes || 0);

  const handleRate = (val) => {
    setRating(val);
    store.setRating('notes', val);
    toast.success('Rating saved!');
  };

  const handleRegenerate = async () => {
    if (!store.subject || !store.chapter) {
      toast.error('No subject setup found. Go to Setup first.');
      return;
    }
    const text = await generate(
      `Generate structured ${store.noteStyle} study notes for "${store.chapter}" in ${store.subject} at ${store.level} level. Include headings, bullet points, key concepts.`,
      '', 'notes'
    );
    if (text) { store.setNotes(text); toast.success('Notes regenerated!'); }
  };

  if (loading) return <Loader text="Regenerating notes…" />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Study Notes</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {store.subject && <Badge variant="accent"><BookOpen size={11} /> {store.subject}</Badge>}
            {store.chapter && <Badge variant="purple">{store.chapter}</Badge>}
            {store.level && <Badge variant="ghost" className="capitalize">{store.level}</Badge>}
            {store.noteStyle && <Badge variant="teal" className="capitalize">{store.noteStyle}</Badge>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="ghost" onClick={() => window.print()} icon={Printer} size="sm">Print</Button>
          <Button onClick={handleRegenerate} loading={loading} icon={RefreshCw} size="sm">Regenerate</Button>
        </div>
      </div>

      {/* Star rating */}
      <div className="card flex items-center gap-4">
        <span className="text-sm text-slate-600">Rate these notes:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => handleRate(s)} className="transition-transform hover:scale-125">
              <Star size={20} className={s <= rating ? 'fill-accent text-accent' : 'text-slate-300'} />
            </button>
          ))}
        </div>
      </div>

      {/* Notes content */}
      <div className="card">
        {store.notes ? (
          <div className="prose prose-slate prose-sm max-w-none
            prose-headings:text-slate-900 prose-headings:font-display
            prose-h2:text-xl prose-h2:text-accent prose-h2:border-b prose-h2:border-border prose-h2:pb-2
            prose-p:text-slate-700 prose-li:text-slate-700
            prose-strong:text-accent prose-code:text-purple prose-code:bg-surface2 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown>{store.notes}</ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <BookOpen size={40} className="mx-auto mb-4 opacity-30" />
            <p>No notes generated yet.</p>
            <p className="text-sm mt-1">Go to Setup and click "Generate All Study Content"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notes;
