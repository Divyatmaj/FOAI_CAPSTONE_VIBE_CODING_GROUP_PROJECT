import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

const QuizResults = ({ scorePercent, score, total, feedback, weakTopics, onRetry, onReset }) => {
  const color = scorePercent >= 80 ? 'text-success' : scorePercent >= 60 ? 'text-accent' : 'text-danger';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto space-y-6"
    >
      {/* Score circle */}
      <div className="card text-center py-10">
        <Trophy size={40} className="mx-auto mb-4 text-accent" />
        <p className={`text-6xl font-bold font-display ${color}`}>{scorePercent}%</p>
        <p className="text-gray-400 mt-2 text-sm">{score} / {total} correct</p>
        <ProgressBar value={score} max={total} color={scorePercent >= 80 ? 'success' : scorePercent >= 60 ? 'accent' : 'danger'} className="mt-6" height="h-3" />
      </div>

      {feedback && (
        <div className="card bg-purple/5 border-purple/20">
          <p className="text-xs text-purple font-semibold uppercase tracking-wide mb-2">AI Feedback</p>
          <p className="text-sm text-gray-300 leading-relaxed">{feedback}</p>
        </div>
      )}

      {weakTopics?.length > 0 && (
        <div className="card">
          <p className="text-xs text-danger font-semibold uppercase tracking-wide mb-3">Needs Review</p>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((t) => (
              <span key={t} className="px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-full text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={onRetry} icon={RefreshCw}>Retry Quiz</Button>
        <Button fullWidth onClick={onReset} icon={RotateCcw}>New Quiz</Button>
      </div>
    </motion.div>
  );
};

export default QuizResults;
