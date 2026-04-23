import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, ChevronRight, BookOpen, Calendar, Clock, Layers } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import { parseJSON } from '../../utils/parseAI';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const TEMPLATES = [
  'Photosynthesis', 'French Revolution', 'Quadratic Equations',
  'Newton\'s Laws', 'DNA Replication', 'World War II',
  'Trigonometry', 'Periodic Table', 'The Great Gatsby', 'Thermodynamics',
];

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const NOTE_STYLES = ['concise', 'detailed', 'bullet', 'narrative'];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Setup = () => {
  const store = useAppStore();
  const { generate, loading } = useAI();
  const navigate = useNavigate();
  const [localSubtopics, setLocalSubtopics] = useState(store.subtopics.join(', '));

  const handleGenerate = async () => {
    if (!store.subject || !store.chapter) {
      toast.error('Please enter a subject and chapter name.');
      return;
    }
    const apiKey = store.apiKey || localStorage.getItem('or_key');
    if (!apiKey) {
      toast.error('API key is missing! Please add it in Settings.');
      return;
    }
    const subtopicsArr = localSubtopics.split(',').map((s) => s.trim()).filter(Boolean);
    store.setSubtopics(subtopicsArr);

    toast.loading('Generating your study content…', { id: 'gen' });
    try {
      // Parallel AI calls
      const [notesText, flashcardsText, plannerText, quizText] = await Promise.all([
        generate(
          `Generate structured ${store.noteStyle} study notes for:\nSubject: ${store.subject}\nChapter: ${store.chapter}\nLevel: ${store.level}\nSubtopics: ${subtopicsArr.join(', ') || 'all main topics'}\n\nFormat as markdown with ## headings, bullet points, key terms bolded.`,
          '', 'notes'
        ),
        generate(
          `Generate exactly 12 flashcards for "${store.chapter}" in ${store.subject} at ${store.level} level.\nReturn ONLY a JSON array: [{"q":"...","a":"...","hint":"...","topic":"...","difficulty":"easy|medium|hard"}]`,
          '', 'flashcards'
        ),
        generate(
          `Create a study planner from today for "${store.chapter}" exam on ${store.examDate || 'in 14 days'}. ${store.hoursPerDay} hours/day.\nReturn ONLY a JSON array: [{"day":1,"date":"YYYY-MM-DD","topics":["..."],"hours":2,"focus":"...","type":"study|revision|practice|rest","done":false}]`,
          '', 'planner'
        ),
        generate(
          `Generate 10 multiple-choice questions for "${store.chapter}" in ${store.subject} at ${store.level} level.\nReturn ONLY a JSON array: [{"q":"...","options":["A...","B...","C...","D..."],"answer":"A|B|C|D","topic":"...","difficulty":"easy|medium|hard","explanation":"..."}]`,
          '', 'quiz'
        ),
      ]);

      store.setNotes(notesText || '# Notes\nCould not generate notes. Try again.');
      store.setFlashcards(parseJSON(flashcardsText, []).map((c, i) => ({ ...c, id: i })));
      store.setPlanner(parseJSON(plannerText, []));
      store.setQuizQuestions(parseJSON(quizText, []));

      toast.success('Study content ready!', { id: 'gen' });
      navigate('/student/notes');
    } catch (e) {
      toast.error(e.message || 'Generation failed', { id: 'gen' });
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900">Study Setup</h1>
        <p className="text-slate-600 mt-1 text-sm">Configure your study session and let AI generate everything</p>
      </div>

      {/* Current summary */}
      {store.subject && (
        <div className="card flex flex-wrap gap-3 items-center">
          <Badge variant="accent"><BookOpen size={11} /> {store.subject}</Badge>
          <Badge variant="purple">{store.chapter}</Badge>
          <Badge variant="ghost">{store.level}</Badge>
          {store.examDate && <Badge variant="teal"><Calendar size={11} /> {store.examDate}</Badge>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Subject Details</h2>
            <div>
              <label className="label">Subject *</label>
              <input className="input" placeholder="e.g. Biology, Mathematics" value={store.subject} onChange={(e) => store.setSubject(e.target.value)} />
            </div>
            <div>
              <label className="label">Chapter / Topic *</label>
              <input className="input" placeholder="e.g. Chapter 5: Genetics" value={store.chapter} onChange={(e) => store.setChapter(e.target.value)} />
            </div>
            <div>
              <label className="label">Subtopics (comma-separated)</label>
              <input className="input" placeholder="e.g. Mitosis, Meiosis, DNA" value={localSubtopics} onChange={(e) => setLocalSubtopics(e.target.value)} />
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Schedule</h2>
            <div>
              <label className="label">Exam Date</label>
              <input
                type="date" className="input"
                value={store.examDate}
                onChange={(e) => store.setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="label">Hours per Day: <span className="text-accent font-bold">{store.hoursPerDay}h</span></label>
              <input type="range" min={1} max={10} value={store.hoursPerDay}
                onChange={(e) => store.setHoursPerDay(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Learning Preferences</h2>
            <div>
              <label className="label">Level</label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => store.setLevel(l)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${store.level === l ? 'bg-accent/10 border-accent/30 text-accent' : 'border-border text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Note Style</label>
              <div className="grid grid-cols-2 gap-2">
                {NOTE_STYLES.map((s) => (
                  <button key={s} onClick={() => store.setNoteStyle(s)}
                    className={`py-2 rounded-xl border text-sm font-medium capitalize transition-all ${store.noteStyle === s ? 'bg-purple/10 border-purple/30 text-purple' : 'border-border text-slate-600 hover:border-slate-300 hover:text-slate-900'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick templates */}
          <div className="card space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Quick Templates</h2>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button key={t} onClick={() => { store.setChapter(t); }}
                  className="px-3 py-1.5 bg-surface2 rounded-lg border border-border text-xs text-slate-600 hover:text-accent hover:border-accent/30 transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleGenerate} loading={loading} size="lg" icon={Sparkles} className="w-full sm:w-auto">
        Generate All Study Content
      </Button>
    </motion.div>
  );
};

export default Setup;
