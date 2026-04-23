import React from 'react';

const VARIANTS = {
  accent:  'bg-accent/10 text-accent border border-accent/20',
  purple:  'bg-purple/10 text-purple border border-purple/20',
  teal:    'bg-teal/10 text-teal border border-teal/20',
  blue:    'bg-blue/10 text-blue border border-blue/20',
  danger:  'bg-danger/10 text-danger border border-danger/20',
  success: 'bg-success/10 text-success border border-success/20',
  ghost:   'bg-surface2 text-gray-400 border border-border',
};

const Badge = ({ children, variant = 'ghost', className = '' }) => (
  <span className={`badge ${VARIANTS[variant] || VARIANTS.ghost} ${className}`}>
    {children}
  </span>
);

export default Badge;
