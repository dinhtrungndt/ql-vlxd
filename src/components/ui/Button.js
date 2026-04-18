import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon = null,
  fullWidth = false,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-800',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {icon && <span className="mr-2 h-5 w-5">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
