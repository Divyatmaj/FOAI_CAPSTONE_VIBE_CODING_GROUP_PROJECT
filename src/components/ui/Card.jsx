import React from 'react';

const Card = ({ children, className = '', onClick, hover = false }) => (
  <div
    className={`card ${hover ? 'cursor-pointer hover:border-accent/40 transition-colors' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default Card;
