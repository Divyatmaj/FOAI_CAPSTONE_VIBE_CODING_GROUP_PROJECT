import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Reports = () => {
  const { students } = useAppStore();

  const handleExport = () => {
    const csv = ['Name,Subject,Score,Streak,Status', ...students.map((s) => `${s.name},${s.subject},${s.score}%,${s.streak}d,${s.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'student_reports.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Reports exported!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Detailed per-student performance reports</p>
        </div>
        <Button variant="ghost" icon={Download} onClick={handleExport}>Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {students.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-purple/20 flex items-center justify-center text-sm font-bold text-white">
                {s.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-semibold">{s.name}</p>
                <p className="text-gray-500 text-xs">{s.subject}</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Score</span>
                <span className={`font-bold ${s.score>=80?'text-success':s.score>=70?'text-accent':'text-danger'}`}>{s.score}%</span>
              </div>
              <ProgressBar value={s.score} max={100} color={s.score>=80?'success':s.score>=70?'accent':'danger'} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="bg-surface2 rounded-lg p-2 text-center">
                <p className="text-white font-bold">{s.streak}</p>
                <p>Day streak</p>
              </div>
              <div className="bg-surface2 rounded-lg p-2 text-center">
                <p className={`font-bold ${s.score>=70?'text-success':'text-danger'}`}>{s.score>=70?'On Track':'At Risk'}</p>
                <p>Status</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-600">Last active: {s.lastSeen}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Reports;
