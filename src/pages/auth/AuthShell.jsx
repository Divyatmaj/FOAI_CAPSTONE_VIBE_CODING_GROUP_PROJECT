import React from 'react';
import { motion } from 'framer-motion';

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="card p-7 sm:p-8">
          <div className="flex flex-col items-center text-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold-gradient text-white shadow-glow flex items-center justify-center text-xl">
              ✨
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink">{title}</h1>
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="mt-6 pt-6 border-t border-white/70 text-center text-sm text-muted">{footer}</div>}
        </div>
        <p className="text-[11px] text-muted text-center mt-6">
          Smart Study Assistant+ • Serene Scholar
        </p>
      </motion.div>
    </div>
  );
};

export default AuthShell;

