import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Layers, Zap } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import MetricCard from '../../components/ui/MetricCard';
import ScoreHistoryChart from '../../components/charts/ScoreHistoryChart';
import WeakTopicsChart from '../../components/charts/WeakTopicsChart';
import HeatmapGrid from '../../components/charts/HeatmapGrid';
import ProgressBar from '../../components/ui/ProgressBar';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Progress = () => {
  const { scores, cardsStudied, flashcards, weakTopics, studyHeatmap, subtopics } = useAppStore();

  const avgScore  = scores.length ? Math.round(scores.reduce((a,b) => a+b,0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const weakList  = Object.entries(weakTopics).sort(([,a],[,b])=>b-a).slice(0,5);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-slate-900">Progress</h1>
        <p className="text-slate-600 text-sm mt-1">Your learning journey at a glance</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Quiz Attempts" value={scores.length} icon={Target}  color="accent"   index={0} />
        <MetricCard label="Avg Score"     value={avgScore}      suffix="%" icon={Zap}     color="purple"  index={1} />
        <MetricCard label="Best Score"    value={bestScore}     suffix="%" icon={Trophy}  color="success" index={2} />
        <MetricCard label="Cards Studied" value={cardsStudied}  icon={Layers}  color="teal"    index={3} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Score History</h2>
          <ScoreHistoryChart scores={scores} />
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Weak Topics</h2>
          <WeakTopicsChart weakTopics={weakTopics} />
        </div>
      </div>

      {/* Heatmap */}
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">28-Day Activity</h2>
        <HeatmapGrid heatmap={studyHeatmap} />
      </div>

      {/* Weak topics list */}
      {weakList.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Needs Most Attention</h2>
          <div className="space-y-3">
            {weakList.map(([topic, count], i) => (
              <div key={topic}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{topic}</span>
                  <span className="text-danger font-mono">{count} miss{count>1?'es':''}</span>
                </div>
                <ProgressBar value={count} max={weakList[0][1]} color="danger" height="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topic coverage */}
      {subtopics?.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Topic Coverage</h2>
          <div className="space-y-3">
            {subtopics.map((topic) => {
              const covered = !weakTopics[topic] || weakTopics[topic] < 2;
              return (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{topic}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${covered ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {covered ? '✓ Studied' : '⚠ Needs work'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Progress;
