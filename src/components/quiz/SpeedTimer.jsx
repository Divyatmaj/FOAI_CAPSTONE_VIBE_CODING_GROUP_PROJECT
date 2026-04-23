import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SpeedTimer = ({ duration = 15, onTimeout, active }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, active]);

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) { onTimeout?.(); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, active, onTimeout]);

  const pct = timeLeft / duration;
  const size = 56, stroke = 4, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct > 0.5 ? '#5dd97a' : pct > 0.25 ? '#f5c842' : '#f26b6b';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2e3040" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 0.4 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-bold font-mono" style={{ color }}>{timeLeft}</span>
    </div>
  );
};

export default SpeedTimer;
