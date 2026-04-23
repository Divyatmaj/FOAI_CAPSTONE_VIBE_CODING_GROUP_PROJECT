import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = 'Generating with AI...', size = 'lg' }) => {
  const rings = size === 'lg' ? [60, 50, 40] : [30, 24, 18];
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative" style={{ width: rings[0], height: rings[0] }}>
        {rings.map((r, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: i === 0 ? '#f5c842' : i === 1 ? '#8b7cf8' : '#3dcfb4',
              width: r, height: r,
              top: (rings[0] - r) / 2, left: (rings[0] - r) / 2,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2 + i * 0.4, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>
      {text && (
        <motion.p
          className="text-gray-400 text-sm font-display"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
