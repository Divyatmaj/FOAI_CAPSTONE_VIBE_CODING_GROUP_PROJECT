import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ label, value, icon: Icon, color = 'accent', suffix = '', index = 0 }) => {
  const colors = {
    accent:  { text: 'text-accent',  bg: 'bg-accent/10',  ring: 'ring-accent/20' },
    purple:  { text: 'text-purple',  bg: 'bg-purple/10',  ring: 'ring-purple/20' },
    teal:    { text: 'text-teal',    bg: 'bg-teal/10',    ring: 'ring-teal/20' },
    blue:    { text: 'text-blue',    bg: 'bg-blue/10',    ring: 'ring-blue/20' },
    danger:  { text: 'text-danger',  bg: 'bg-danger/10',  ring: 'ring-danger/20' },
    success: { text: 'text-success', bg: 'bg-success/10', ring: 'ring-success/20' },
  };
  const c = colors[color] || colors.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card flex items-center gap-4"
    >
      {Icon && (
        <div className={`p-3 rounded-xl ${c.bg} ring-1 ${c.ring}`}>
          <Icon size={20} className={c.text} />
        </div>
      )}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
        <p className={`text-2xl font-bold font-display ${c.text}`}>
          {value}{suffix}
        </p>
      </div>
    </motion.div>
  );
};

export default MetricCard;
