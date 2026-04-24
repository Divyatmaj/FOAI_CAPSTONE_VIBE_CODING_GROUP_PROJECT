import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Brain, RefreshCw, ChevronRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import useQuiz from '../../hooks/useQuiz';
import QuizQuestion from '../../components/quiz/QuizQuestion';
import QuizResults from '../../components/quiz/QuizResults';
import SpeedTimer from '../../components/quiz/SpeedTimer';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import Loader from '../../components/ui/Loader';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Quiz = () => {
  const store = useAppStore();
  const { generate, loading } = useAI();
  const { quizState, currentQuestion, quizQuestions, scorePercent, startQuiz, answer, resetQuiz, nextQuestion } = useQuiz();

  const [feedback, setFeedback] = useState('');
  const [timedOut, setTimedOut] = useState(false);
  const [weakList, setWeakList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // 🔥 ULTRA SAFE PARSER (FINAL FIX)
  const safeParseQuiz = (text) => {
    try {
      if (!text) return [];

      console.log("🤖 RAW AI:", text);

      // extract JSON array even if messy
      const match = text.match(/\[\s*{[\s\S]*}\s*\]/);

      if (!match) {
        console.error("❌ No JSON found");
        return [];
      }

      const jsonString = match[0];

      const data = JSON.parse(jsonString);

      if (!Array.isArray(data)) return [];

      return data.map((q) => ({
        question: q.question || q.q || '',
        options: q.options || [],
        answer: q.answer,
        topic: q.topic || '',
        difficulty: q.difficulty || '',
        explanation: q.explanation || ''
      }));

    } catch (err) {
      console.error("❌ PARSE FAILED:", err);
      return [];
    }
  };

  const handleGenerate = async () => {
    if (!store.subject) {
      toast.error('Setup your subject first.');
      return;
    }

   const text = await generate(
`Generate 10 multiple-choice questions for "${store.chapter || store.subject}" at ${store.level} level.

STRICT RULES:
- Output ONLY valid JSON
- Do NOT include markdown (no \`\`\`)
- Do NOT include any explanation outside JSON
- Do NOT include numbering or text before/after JSON
- Each question MUST have exactly 4 options
- The "answer" MUST be one of: "A", "B", "C", "D" (NOT full text)

FORMAT:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "A",
    "topic": "topic name",
    "difficulty": "easy",
    "explanation": "short explanation"
  }
]
`,
'',
'quiz'
);


    const q = safeParseQuiz(text);

    if (!q.length || !q[0].question || !q[0].options?.length) {
      toast.error('AI returned invalid format. Try again.');
      return;
    }

    store.setQuizQuestions(q);
    toast.success('Questions ready!');
  };

  const handleStart = (mode) => {
    setFeedback('');
    setTimedOut(false);
    setWeakList([]);
    setFeedbackLoading(false);
    startQuiz(mode);
  };

  const handleAnswer = async (key) => {
    if (timedOut) return;
    answer(key);

    const freshState = useAppStore.getState().quizState;

    if (freshState?.finished) {
      const freshScores = useAppStore.getState().scores;
      const latestScore = freshScores[freshScores.length - 1] || 0;

      const weak = Object.entries(useAppStore.getState().weakTopics)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([t]) => t);

      setWeakList(weak);
      setFeedbackLoading(true);

      const fb = await generate(
        `The student scored ${latestScore}%. Weak topics: ${weak.join(', ') || 'none'}. Give short positive feedback.`,
        'Be concise and encouraging.',
        'feedback'
      );

      setFeedback(fb);
      setFeedbackLoading(false);
    }
  };

  const handleTimeout = () => {
    setTimedOut(true);
    if (currentQuestion) answer('__timeout__');
  };

  const handleNext = useCallback(() => {
    setTimedOut(false);
    nextQuestion();
  }, [nextQuestion]);

  if (loading && !quizState) return <Loader text="Generating quiz…" />;

  if (!quizState && !quizQuestions.length) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate">
        <h1 className="text-3xl text-white">Quiz</h1>
        <Button onClick={handleGenerate}>Generate Questions</Button>
      </motion.div>
    );
  }

  if (!quizState) {
    return (
      <motion.div>
        <Button onClick={() => handleStart('standard')}>Start Quiz</Button>
      </motion.div>
    );
  }

  if (quizState.finished) {
    return (
      <QuizResults
        scorePercent={scorePercent}
        score={quizState.score}
        total={quizQuestions.length}
        feedback={feedback}
        weakTopics={weakList}
        onRetry={() => handleStart(quizState.mode)}
        onReset={resetQuiz}
      />
    );
  }

  const current = quizState.current;
  const answered = quizState.answered[current];

  return (
    <div>
      <h2>Question {current + 1}</h2>

      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        answered={answered}
      />

      {answered && (
        <Button onClick={handleNext} icon={ChevronRight}>
          Next
        </Button>
      )}
    </div>
  );
};

export default Quiz;