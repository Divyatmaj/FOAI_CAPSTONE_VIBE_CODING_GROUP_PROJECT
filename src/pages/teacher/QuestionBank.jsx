import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, Plus, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import { parseJSON } from '../../utils/parseAI';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const DIFFICULTY_VARIANT = { easy: 'success', medium: 'accent', hard: 'danger' };
const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const QuestionBank = () => {
  const { customQuestions, addCustomQuestion, removeCustomQuestion } = useAppStore();
  const { generate, loading } = useAI();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [manual, setManual] = useState({ q: '', answer: '', topic: '', difficulty: 'medium' });

const handleGenerate = async () => {
  if (!topic) {
    toast.error('Enter a topic.');
    return;
  }

  const text = await generate(
    `Generate ${count} multiple-choice questions about "${topic}" at ${difficulty} difficulty.

STRICT RULES:
- Return ONLY JSON array
- No explanation
- No markdown
- No text outside JSON

Format:
[
  {
    "question": "text",
    "options": ["option1", "option2", "option3", "option4"],
    "answer": "A",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "explanation": "short explanation"
  }
]
`,
    '',
    'quiz'
  );

  // 🔥 SAME SAFE PARSER (VERY IMPORTANT)
  const safeParseQuiz = (text) => {
    try {
      if (!text) return [];

      const match = text.match(/\[\s*{[\s\S]*}\s*\]/);
      if (!match) return [];

      const data = JSON.parse(match[0]);

      if (!Array.isArray(data)) return [];

      return data.map((q) => ({
        q: q.question || q.q || '',
        options: q.options || [],
        answer: q.answer,
        topic: q.topic || '',
        difficulty: q.difficulty || '',
        explanation: q.explanation || ''
      }));

    } catch (err) {
      console.error("❌ PARSE FAILED:", text);
      return [];
    }
  };

  const qs = safeParseQuiz(text);

  if (!qs.length || !qs[0].q) {
    toast.error('Could not parse questions.');
    return;
  }

  qs.forEach((q) => addCustomQuestion(q));
  toast.success(`${qs.length} questions added!`);
};

  const handleManualAdd = () => {
    if (!manual.q || !manual.answer) { toast.error('Question and answer are required.'); return; }
    addCustomQuestion({ ...manual, options: ['A. Option 1','B. Option 2','C. Option 3','D. Option 4'] });
    setManual({ q: '', answer: '', topic: '', difficulty: 'medium' });
    toast.success('Question added!');
  };

  if (loading) return <Loader text="Generating questions…" />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Question Bank</h1>
        <p className="text-gray-400 text-sm mt-1">{customQuestions.length} questions in bank</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Generate */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">AI Generate</h2>
          <div><label className="label">Topic</label><input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Photosynthesis" /></div>
          <div>
            <label className="label">Difficulty</label>
            <div className="flex gap-2">
              {['easy','medium','hard'].map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl border text-sm capitalize transition-all ${difficulty===d?'bg-accent/10 border-accent text-accent':'border-border text-gray-400'}`}>{d}</button>
              ))}
            </div>
          </div>
          <div><label className="label">Count</label><input type="number" min={1} max={20} className="input" value={count} onChange={(e) => setCount(Number(e.target.value))} /></div>
          <Button fullWidth icon={Sparkles} onClick={handleGenerate} loading={loading}>Generate Questions</Button>
        </div>

        {/* Manual Add */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Add Manually</h2>
          <div><label className="label">Question</label><textarea className="input resize-none h-20" value={manual.q} onChange={(e) => setManual({...manual,q:e.target.value})} placeholder="Question text" /></div>
          <div><label className="label">Correct Answer</label><input className="input" value={manual.answer} onChange={(e) => setManual({...manual,answer:e.target.value})} placeholder="A / B / C / D" /></div>
          <div><label className="label">Topic</label><input className="input" value={manual.topic} onChange={(e) => setManual({...manual,topic:e.target.value})} placeholder="Topic name" /></div>
          <Button fullWidth icon={Plus} onClick={handleManualAdd}>Add Question</Button>
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {customQuestions.map((q) => (
          <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-white font-medium mb-2">{q.q}</p>
              <div className="flex items-center gap-2">
                <Badge variant={DIFFICULTY_VARIANT[q.difficulty] || 'ghost'} className="capitalize">{q.difficulty}</Badge>
                {q.topic && <Badge variant="ghost">{q.topic}</Badge>}
                <span className="text-xs text-gray-500">Answer: <span className="text-accent font-bold">{q.answer}</span></span>
              </div>
            </div>
            <button onClick={() => removeCustomQuestion(q.id)} className="p-2 text-gray-500 hover:text-danger transition-colors">
              <Trash2 size={15} />
            </button>
          </motion.div>
        ))}
        {!customQuestions.length && (
          <div className="card text-center py-12 text-gray-500">
            <Brain size={36} className="mx-auto mb-3 opacity-30" />
            <p>No questions yet. Generate or add manually.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionBank;
