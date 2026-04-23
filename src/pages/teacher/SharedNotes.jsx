import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, Plus, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
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

  // 🔥 FINAL FIXED GENERATE FUNCTION
  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Enter a topic.');
      return;
    }

    try {
      const text = await generate(
        `Generate ${count} MCQ questions about "${topic}" (${difficulty} level).

Return ONLY JSON array:

[
  {
    "question": "text",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "explanation": "short explanation"
  }
]`,
        '',
        'quiz'
      );

      console.log("🤖 RAW AI:", text);

      let data = [];

      // 🔥 Extract JSON safely
      const match = text?.match(/\[\s*{[\s\S]*}\s*\]/);
      if (match) {
        data = JSON.parse(match[0]);
      }

      if (!Array.isArray(data) || !data.length) {
        throw new Error("Invalid AI format");
      }

      // 🔥 Normalize format
      const finalQs = data.map((q) => ({
        q: q.question || q.q || '',
        options: q.options || [
          "A. Option 1",
          "B. Option 2",
          "C. Option 3",
          "D. Option 4"
        ],
        answer: q.answer || "A",
        topic: q.topic || topic,
        difficulty: q.difficulty || difficulty,
        explanation: q.explanation || ''
      }));

      finalQs.forEach((q) => addCustomQuestion(q));

      toast.success(`${finalQs.length} questions added!`);

    } catch (err) {
      console.error("❌ FINAL ERROR:", err);
      toast.error('Could not parse questions.');
    }
  };

  const handleManualAdd = () => {
    if (!manual.q || !manual.answer) {
      toast.error('Question and answer are required.');
      return;
    }

    addCustomQuestion({
      ...manual,
      options: ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4']
    });

    setManual({ q: '', answer: '', topic: '', difficulty: 'medium' });
    toast.success('Question added!');
  };

  if (loading) return <Loader text="Generating questions…" />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">Question Bank</h1>
        <p className="text-gray-400 text-sm mt-1">{customQuestions.length} questions in bank</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI Generate */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">AI Generate</h2>

          <input
            className="input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (e.g. Photosynthesis)"
          />

          <div className="flex gap-2">
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-2 rounded-xl border capitalize ${
                  difficulty === d ? 'bg-accent/10 border-accent text-accent' : 'border-border text-gray-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <input
            type="number"
            min={1}
            max={20}
            className="input"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />

          <Button fullWidth icon={Sparkles} onClick={handleGenerate}>
            Generate Questions
          </Button>
        </div>

        {/* Manual Add */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Add Manually</h2>

          <textarea
            className="input h-20"
            value={manual.q}
            onChange={(e) => setManual({ ...manual, q: e.target.value })}
            placeholder="Question"
          />

          <input
            className="input"
            value={manual.answer}
            onChange={(e) => setManual({ ...manual, answer: e.target.value })}
            placeholder="A / B / C / D"
          />

          <input
            className="input"
            value={manual.topic}
            onChange={(e) => setManual({ ...manual, topic: e.target.value })}
            placeholder="Topic"
          />

          <Button fullWidth icon={Plus} onClick={handleManualAdd}>
            Add Question
          </Button>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {customQuestions.map((q) => (
          <div key={q.id} className="card flex justify-between">
            <div>
              <p className="text-white">{q.q}</p>
              <span className="text-sm text-gray-400">Answer: {q.answer}</span>
            </div>
            <button onClick={() => removeCustomQuestion(q.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {!customQuestions.length && (
          <div className="card text-center py-10 text-gray-500">
            No questions yet.
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default QuestionBank;