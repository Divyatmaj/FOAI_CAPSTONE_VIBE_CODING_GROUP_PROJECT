import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, AlertTriangle, TrendingUp, Flame } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import MetricCard from '../../components/ui/MetricCard';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Overview = () => {
  const { students } = useAppStore();
  const atRisk   = students.filter((s) => s.score < 70).length;
  const avgScore = students.length ? Math.round(students.reduce((a, s) => a + s.score, 0) / students.length) : 0;
  const maxStreak = students.length ? Math.max(...students.map((s) => s.streak)) : 0;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Parent Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor your children's academic progress</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Children"   value={students.length} icon={GraduationCap} color="accent"  index={0} />
        <MetricCard label="At Risk"    value={atRisk}          icon={AlertTriangle} color="danger"  index={1} />
        <MetricCard label="Avg Score"  value={avgScore}        suffix="%" icon={TrendingUp} color="purple" index={2} />
        <MetricCard label="Best Streak" value={maxStreak}      suffix="d" icon={Flame}     color="success" index={3} />
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Performance Summary</h2>
        <div className="space-y-4">
          {students.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 sm:w-48">
                <div className="w-9 h-9 rounded-xl bg-surface2 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {s.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{s.name.split(' ')[0]}</p>
                  <p className="text-gray-500 text-[10px]">{s.subject}</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <ProgressBar value={s.score} max={100} color={s.score>=80?'success':s.score>=70?'accent':'danger'} className="flex-1" />
                <span className={`text-sm font-bold shrink-0 ${s.score>=80?'text-success':s.score>=70?'text-accent':'text-danger'}`}>{s.score}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">🔥{s.streak}d</span>
                {s.score < 70 && <Badge variant="danger">At Risk</Badge>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
