import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const UPCOMING = [
  { subject: 'Physics Chapter 6', with: 'Clara Davis', date: '2025-04-17', time: '4:00 PM', type: 'video' },
  { subject: 'Math Problem Set',  with: 'Frank Miller', date: '2025-04-18', time: '7:30 PM', type: 'chat' },
];

const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const StudySchedule = () => {
  const [form, setForm] = useState({ subject: '', buddy: '', date: '', time: '', type: 'video' });

  const handleSchedule = () => {
    if (!form.subject || !form.buddy) { toast.error('Fill in subject and buddy name.'); return; }
    toast.success(`Session scheduled with ${form.buddy}!`);
    setForm({ subject: '', buddy: '', date: '', time: '', type: 'video' });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Study Schedule</h1>
        <p className="text-gray-400 text-sm mt-1">Plan your joint study sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2"><Plus size={14} /> Schedule Session</h2>
          <div><label className="label">Subject/Topic</label><input className="input" value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} placeholder="e.g. Calculus Derivatives" /></div>
          <div><label className="label">Buddy's Name</label><input className="input" value={form.buddy} onChange={(e)=>setForm({...form,buddy:e.target.value})} placeholder="e.g. Alice Johnson" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} /></div>
            <div><label className="label">Time</label><input type="time" className="input" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} /></div>
          </div>
          <div>
            <label className="label">Session Type</label>
            <div className="flex gap-2">
              {['video','chat','in-person'].map((t)=>(
                <button key={t} onClick={()=>setForm({...form,type:t})} className={`flex-1 py-2 rounded-xl border text-xs capitalize transition-all ${form.type===t?'bg-teal/10 border-teal text-teal':'border-border text-gray-400'}`}>{t}</button>
              ))}
            </div>
          </div>
          <Button fullWidth icon={Calendar} onClick={handleSchedule}>Schedule</Button>
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2"><Calendar size={14} /> Upcoming Sessions</h2>
          {UPCOMING.map((s, i) => (
            <div key={i} className="p-4 bg-surface2 rounded-xl border border-border">
              <div className="flex items-start justify-between mb-2">
                <p className="text-white text-sm font-semibold">{s.subject}</p>
                <Badge variant="teal" className="capitalize">{s.type}</Badge>
              </div>
              <p className="text-gray-400 text-xs flex items-center gap-1"><Users size={11}/> with {s.with}</p>
              <p className="text-gray-400 text-xs mt-1">{s.date} at {s.time}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StudySchedule;
