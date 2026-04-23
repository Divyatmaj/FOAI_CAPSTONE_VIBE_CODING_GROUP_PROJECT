import React from 'react';
import { motion } from 'framer-motion';

const PomodoroRing = ({ progress = 0, running = false, size = 220 }) => {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, progress));

  return (
    <div className={`relative flex items-center justify-center ${running ? 'ring-glow' : ''}`}
         style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1d2028" strokeWidth={stroke} />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#gold-grad)"
          strokeWidth={stroke}
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5c842" />
            <stop offset="100%" stopColor="#e6a817" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center dot indicator */}
      {running && (
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-accent"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            top: stroke / 2,
            left: size / 2 - 6,
          }}
        />
      )}
    </div>
  );
};

export default PomodoroRing;
