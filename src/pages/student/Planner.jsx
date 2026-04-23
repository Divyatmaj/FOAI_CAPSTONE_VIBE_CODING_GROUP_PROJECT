import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../../store/useAppStore';
import useAI from '../../hooks/useAI';
import { parseJSON } from '../../utils/parseAI';
import { daysUntil } from '../../utils/formatters';
import Button from '../../components/ui/Button';
import MetricCard from '../../components/ui/MetricCard';
import Badge from '../../components/ui/Badge';

const TYPE_STYLES = {
  study:    { bg: 'bg-blue/10 border-blue/30',     text: 'text-blue',    badge: 'blue'    },
  revision: { bg: 'bg-purple/10 border-purple/30', text: 'text-purple',  badge: 'purple'  },
  practice: { bg: 'bg-accent/10 border-accent/30', text: 'text-accent',  badge: 'accent'  },
  rest:     { bg: 'bg-surface2 border-border',      text: 'text-slate-600', badge: 'ghost' },
};

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Planner = () => {
  const store = useAppStore();
  const { generate, loading } = useAI();

  const daysLeft = daysUntil(store.examDate);
  const planDays = store.planner.length;
  const totalHours = store.planner.reduce((s, d) => s + (d.hours || 0), 0);
  const doneDays = store.planner.filter((d) => d.done).length;

  const handleRegenerate = async () => {
    if (!store.chapter) { toast.error('Setup your subject first.'); return; }
    const text = await generate(
      `Create a study planner for "${store.chapter}" in ${store.subject}. Exam date: ${store.examDate || 'in 14 days'}. ${store.hoursPerDay} hours/day.\nReturn ONLY a JSON array: [{"day":1,"date":"YYYY-MM-DD","topics":["t1","t2"],"hours":2,"focus":"...","type":"study|revision|practice|rest","done":false}]`,
      '', 'planner'
    );
    const plan = parseJSON(text, []);
    if (plan.length) { store.setPlanner(plan); toast.success('Planner regenerated!'); }
    else toast.error('Could not parse planner. Try again.');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Study Planner</h1>
          <p className="text-slate-600 text-sm mt-1">Click any day card to mark it complete</p>
        </div>
        <Button onClick={handleRegenerate} loading={loading} icon={RefreshCw} size="sm">Regenerate</Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Days Left" value={daysLeft} icon={Calendar} color="accent" index={0} />
        <MetricCard label="Hours/Day" value={store.hoursPerDay} suffix="h" icon={Clock} color="purple" index={1} />
        <MetricCard label="Plan Days" value={planDays} icon={Calendar} color="teal" index={2} />
        <MetricCard label="Total Hours" value={totalHours} suffix="h" icon={Clock} color="blue" index={3} />
      </div>

      {/* Progress */}
      {planDays > 0 && (
        <div className="card">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progress</span>
            <span className="text-accent font-bold">{doneDays} / {planDays} days</span>
          </div>
          <div className="h-2 bg-surface2 rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent rounded-full" style={{ width: `${(doneDays / planDays) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Day cards */}
      {store.planner.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {store.planner.map((day, i) => {
            const styles = TYPE_STYLES[day.type] || TYPE_STYLES.study;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => store.markDayDone(i)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  day.done ? 'bg-success/5 border-success/30 opacity-70' : styles.bg
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-500 font-mono">{day.date}</p>
                    <p className={`text-lg font-bold font-display ${day.done ? 'text-success line-through' : styles.text}`}>
                      Day {day.day}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={styles.badge} className="capitalize">{day.type}</Badge>
                    {day.done && <CheckCircle2 size={18} className="text-success" />}
                  </div>
                </div>
                <p className="text-sm text-slate-700 font-medium mb-2">{day.focus}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {day.topics?.map((t, ti) => (
                    <span key={ti} className="text-[10px] px-2 py-0.5 bg-surface rounded-full border border-border text-slate-600">{t}</span>
                  ))}
                </div>
                <p className="text-xs text-slate-500">{day.hours}h study time</p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-20 text-slate-500">
          <Calendar size={40} className="mx-auto mb-4 opacity-30" />
          <p>No planner generated yet. Go to Setup first.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Planner;
