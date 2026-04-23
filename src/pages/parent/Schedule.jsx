import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Schedule = () => {
  const [blocks, setBlocks] = useState([
    { day: 'Monday',    time: '4:00', activity: 'Math Study', student: 'Alice' },
    { day: 'Wednesday', time: '5:00', activity: 'Biology Review', student: 'Bob' },
    { day: 'Friday',    time: '3:00', activity: 'Physics Practice', student: 'Alice' },
  ]);
  const [form, setForm] = useState({ day: 'Monday', time: '8:00', activity: '', student: '' });

  const handleAdd = () => {
    if (!form.activity || !form.student) { toast.error('Fill in all fields.'); return; }
    setBlocks((b) => [...b, { ...form }]);
    setForm({ ...form, activity: '', student: '' });
    toast.success('Block added!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Weekly Schedule</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your children's study timetable</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add block form */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2"><Plus size={14}/> Add Block</h2>
          <div>
            <label className="label">Day</label>
            <select className="input" value={form.day} onChange={(e)=>setForm({...form,day:e.target.value})}>
              {DAYS.map((d)=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Time</label>
            <select className="input" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})}>
              {HOURS.map((h)=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div><label className="label">Activity</label><input className="input" value={form.activity} onChange={(e)=>setForm({...form,activity:e.target.value})} placeholder="e.g. Math Homework" /></div>
          <div><label className="label">Student</label><input className="input" value={form.student} onChange={(e)=>setForm({...form,student:e.target.value})} placeholder="Child's name" /></div>
          <Button fullWidth icon={Calendar} onClick={handleAdd}>Add to Schedule</Button>
        </div>

        {/* Weekly grid */}
        <div className="lg:col-span-2 card">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">This Week</h2>
          <div className="space-y-2">
            {DAYS.map((day) => {
              const dayBlocks = blocks.filter((b) => b.day === day);
              return (
                <div key={day} className="flex gap-3 items-start py-2 border-b border-border last:border-0">
                  <span className="w-24 text-xs text-gray-500 font-medium shrink-0 pt-1">{day}</span>
                  <div className="flex flex-wrap gap-2">
                    {dayBlocks.map((b, i) => (
                      <span key={i} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-lg border border-accent/20">
                        {b.time} — {b.activity} ({b.student})
                      </span>
                    ))}
                    {!dayBlocks.length && <span className="text-xs text-gray-600 italic">No blocks</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Schedule;
