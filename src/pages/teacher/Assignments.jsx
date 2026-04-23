import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, BookMarked } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';

const STATUS_VARIANT = { active: 'success', overdue: 'danger', upcoming: 'accent' };
const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const Assignments = () => {
  const { assignments, addAssignment, removeAssignment } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', dueDate: '', total: 20 });

  const handleCreate = () => {
    if (!form.title || !form.subject) return;
    addAssignment({ ...form, status: 'upcoming', submissions: 0 });
    setOpen(false); setForm({ title: '', subject: '', dueDate: '', total: 20 });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Assignments</h1>
          <p className="text-gray-400 text-sm mt-1">{assignments.length} total assignments</p>
        </div>
        <Button icon={Plus} onClick={() => setOpen(true)}>New Assignment</Button>
      </div>

      <div className="space-y-3">
        {assignments.map((a) => (
          <motion.div key={a.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            className="card flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-purple/10 rounded-xl"><BookMarked size={18} className="text-purple" /></div>
              <div>
                <p className="text-white font-semibold">{a.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{a.subject} · Due {formatDate(a.dueDate)}</p>
                <p className="text-gray-400 text-xs mt-1">{a.submissions} / {a.total} submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_VARIANT[a.status] || 'ghost'} className="capitalize">{a.status}</Badge>
              <button onClick={() => removeAssignment(a.id)} className="p-2 text-gray-500 hover:text-danger transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Assignment">
        <div className="space-y-4">
          <div><label className="label">Title</label><input className="input" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Assignment title" /></div>
          <div><label className="label">Subject</label><input className="input" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} placeholder="Subject" /></div>
          <div><label className="label">Due Date</label><input type="date" className="input" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} /></div>
          <div><label className="label">Total Students</label><input type="number" className="input" value={form.total} onChange={(e) => setForm({...form, total: Number(e.target.value)})} /></div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setOpen(false)}>Cancel</Button>
            <Button fullWidth onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Assignments;
