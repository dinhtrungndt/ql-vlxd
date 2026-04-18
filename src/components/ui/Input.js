import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    { label, type = 'text', error, helperText, className = '', icon = null, ...props },
    ref
  ) => {
    return (
      <div className={`mb-4 w-full ${className}`}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {icon}
            </div>
          )}
          <input
            {...props}
            ref={ref}
            type={type}
            className={`block w-full rounded-lg border bg-slate-800 p-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
        </div>
        {(error || helperText) && (
          <p
            className={`mt-1.5 text-xs ${
              error ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
