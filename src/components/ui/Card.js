import React from 'react';

const Card = ({ children, className = '', title = null, action = null }) => {
  return (
    <div className={`rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;
