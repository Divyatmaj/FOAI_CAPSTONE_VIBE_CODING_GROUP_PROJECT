import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const MEDALS = ['🥇', '🥈', '🥉'];
const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Leaderboard = () => {
  const { leaderboard } = useAppStore();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Leaderboard</h1>
        <p className="text-gray-400 text-sm mt-1">How you rank among your study buddies</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {leaderboard.slice(0, 3).map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`card text-center py-6 ${i === 0 ? 'ring-1 ring-accent/30' : ''}`}>
            <p className="text-3xl mb-2">{MEDALS[i]}</p>
            <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center text-sm font-bold text-white mx-auto mb-2">{p.avatar}</div>
            <p className="text-white text-xs font-semibold truncate">{p.name}</p>
            <p className="text-accent font-bold mt-1">{p.score.toLocaleString()}</p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {p.badges.map((b, bi) => <span key={bi}>{b}</span>)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full list */}
      <div className="card space-y-2">
        {leaderboard.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${p.name === 'You' ? 'bg-accent/5 border border-accent/20' : 'hover:bg-surface2'}`}>
            <span className="text-lg w-8 text-center">{i < 3 ? MEDALS[i] : <span className="text-gray-500 font-mono text-sm">#{i + 1}</span>}</span>
            <div className="w-9 h-9 rounded-xl bg-surface2 flex items-center justify-center text-xs font-bold text-white shrink-0">{p.avatar}</div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${p.name === 'You' ? 'text-accent' : 'text-white'}`}>{p.name}</p>
              <p className="text-xs text-gray-500">🔥 {p.streak} day streak</p>
            </div>
            <p className={`font-bold font-mono ${i === 0 ? 'text-accent' : 'text-gray-300'}`}>{p.score.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
