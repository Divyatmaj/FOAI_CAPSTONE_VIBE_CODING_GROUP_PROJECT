import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const CHANNELS = ['Email', 'SMS', 'Push', 'WhatsApp'];
const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Reminders = () => {
  const { reminders, addReminder, removeReminder } = useAppStore();
  const [form, setForm] = useState({ title: '', date: '', time: '', channel: 'Email', student: '' });

  const handleAdd = () => {
    if (!form.title || !form.date) { toast.error('Title and date are required.'); return; }
    addReminder({ ...form });
    setForm({ title: '', date: '', time: '', channel: 'Email', student: '' });
    toast.success('Reminder set!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Reminders</h1>
        <p className="text-gray-400 text-sm mt-1">Set study and exam reminders for your children</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2"><Plus size={14}/> New Reminder</h2>
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="e.g. Math exam tomorrow!" /></div>
          <div><label className="label">Student</label><input className="input" value={form.student} onChange={(e)=>setForm({...form,student:e.target.value})} placeholder="Child's name" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Date</label><input type="date" className="input" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} /></div>
            <div><label className="label">Time</label><input type="time" className="input" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} /></div>
          </div>
          <div>
            <label className="label">Channel</label>
            <div className="flex flex-wrap gap-2">
              {CHANNELS.map((c)=>(
                <button key={c} onClick={()=>setForm({...form,channel:c})} className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${form.channel===c?'bg-blue/10 border-blue text-blue':'border-border text-gray-400'}`}>{c}</button>
              ))}
            </div>
          </div>
          <Button fullWidth icon={Bell} onClick={handleAdd}>Set Reminder</Button>
        </div>

        {/* Active reminders */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Active Reminders</h2>
          {reminders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No reminders set yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reminders.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 p-3 bg-surface2 rounded-xl border border-border">
                  <Bell size={14} className="text-blue mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{r.title}</p>
                    <p className="text-gray-500 text-xs">{r.student && `${r.student} · `}{r.date} {r.time}</p>
                    <Badge variant="blue" className="mt-1">{r.channel}</Badge>
                  </div>
                  <button onClick={() => removeReminder(r.id)} className="p-1.5 text-gray-500 hover:text-danger transition-colors shrink-0">
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Reminders;
