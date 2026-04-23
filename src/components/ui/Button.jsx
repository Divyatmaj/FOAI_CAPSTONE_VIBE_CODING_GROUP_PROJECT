import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'btn-primary',
  ghost:   'btn-ghost',
  danger:  'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 px-5 py-2.5 rounded-xl transition-all duration-200',
  success: 'bg-success/10 text-success border border-success/30 hover:bg-success/20 px-5 py-2.5 rounded-xl transition-all duration-200',
};

const Button = ({
  children, variant = 'primary', loading = false,
  disabled = false, className = '', onClick, type = 'button',
  size = 'md', icon: Icon, fullWidth = false,
}) => {
  const sizes = { sm: 'text-xs px-3 py-1.5', md: 'text-sm', lg: 'text-base px-6 py-3' };
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${VARIANTS[variant] || VARIANTS.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} flex items-center justify-center gap-2 font-body ${className}`}
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : Icon ? <Icon size={15} /> : null}
      {children}
    </motion.button>
  );
};

export default Button;
