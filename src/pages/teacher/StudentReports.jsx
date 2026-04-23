import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const StudentReports = () => {
  const { students } = useAppStore();
  const sorted = [...students].sort((a,b) => b.score - a.score);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Student Reports</h1>
        <p className="text-gray-400 text-sm mt-1">Individual performance snapshots</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {sorted.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center text-sm font-bold text-white">
                  {s.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{s.name}</p>
                  <p className="text-gray-500 text-xs">{s.subject}</p>
                </div>
              </div>
              {s.score < 70 && <AlertTriangle size={16} className="text-danger" />}
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Score</span>
                <span className={`font-bold ${s.score>=80?'text-success':s.score>=70?'text-accent':'text-danger'}`}>{s.score}%</span>
              </div>
              <ProgressBar value={s.score} max={100} color={s.score>=80?'success':s.score>=70?'accent':'danger'} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>🔥 {s.streak} day streak</span>
              <Badge variant={s.status==='active'?'success':'danger'} className="capitalize">{s.status}</Badge>
            </div>
            <p className="text-[10px] text-gray-600">Last seen: {s.lastSeen}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StudentReports;
