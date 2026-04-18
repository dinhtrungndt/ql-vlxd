import React from 'react';

const Badge = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    gray: 'bg-slate-800 text-slate-300 border-slate-700',
    blue: 'bg-blue-900/50 text-blue-300 border-blue-800/50',
    green: 'bg-emerald-900/50 text-emerald-300 border-emerald-800/50',
    red: 'bg-red-900/50 text-red-300 border-red-800/50',
    yellow: 'bg-amber-900/50 text-amber-300 border-amber-800/50',
  };

  const colorClass = variants[variant] || variants.gray;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
