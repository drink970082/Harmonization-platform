'use client';

import React, { forwardRef } from 'react';

interface CyberpunkSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  glowColor?: 'cyan' | 'purple' | 'red' | 'green' | 'orange';
  options: { value: string; label: string }[];
}

export const CyberpunkSelect = forwardRef<HTMLSelectElement, CyberpunkSelectProps>(
  ({ label, error, glowColor = 'cyan', options, className = '', ...props }, ref) => {
    const glowClasses = {
      cyan: 'border-cyan-400 focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]',
      purple: 'border-purple-400 focus:border-purple-300 focus:shadow-[0_0_10px_rgba(168,85,247,0.5)]',
      red: 'border-red-400 focus:border-red-300 focus:shadow-[0_0_10px_rgba(239,68,68,0.5)]',
      green: 'border-green-400 focus:border-green-300 focus:shadow-[0_0_10px_rgba(34,197,94,0.5)]',
      orange: 'border-orange-400 focus:border-orange-300 focus:shadow-[0_0_10px_rgba(251,146,60,0.5)]',
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 bg-black/40 backdrop-blur-sm border rounded-lg
              font-mono text-white
              transition-all duration-300
              focus:outline-none focus:ring-0
              appearance-none cursor-pointer
              ${glowClasses[glowColor]}
              ${error ? 'border-red-400' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map(({ value, label }) => (
              <option 
                key={value} 
                value={value}
                className="bg-black text-white"
              >
                {label}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-red-400 text-xs font-mono">{error}</p>
        )}
      </div>
    );
  }
);

CyberpunkSelect.displayName = 'CyberpunkSelect';