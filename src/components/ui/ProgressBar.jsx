import React from 'react';

const COLORS = {
  accent:  'bg-accent',
  purple:  'bg-purple',
  teal:    'bg-teal',
  blue:    'bg-blue',
  danger:  'bg-danger',
  success: 'bg-success',
};

const ProgressBar = ({ value = 0, max = 100, color = 'accent', showLabel = false, height = 'h-2', className = '' }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{value} / {max}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-surface2 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${COLORS[color] || COLORS.accent} ${height} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
