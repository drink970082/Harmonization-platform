'use client';

import React, { forwardRef } from 'react';

interface CyberpunkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  glowColor?: 'cyan' | 'purple' | 'red' | 'green' | 'orange';
}

export const CyberpunkInput = forwardRef<HTMLInputElement, CyberpunkInputProps>(
  ({ label, error, glowColor = 'cyan', className = '', ...props }, ref) => {
    const glowClasses = {
      cyan: 'border-blue-500/30 focus:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] focus:ring-blue-500/20',
      purple: 'border-purple-500/30 focus:border-purple-400 focus:shadow-[0_0_15px_rgba(147,51,234,0.3)] focus:ring-purple-500/20',
      red: 'border-red-500/30 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)] focus:ring-red-500/20',
      green: 'border-emerald-500/30 focus:border-emerald-400 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] focus:ring-emerald-500/20',
      orange: 'border-amber-500/30 focus:border-amber-400 focus:shadow-[0_0_15px_rgba(245,158,11,0.3)] focus:ring-amber-500/20',
    };

    const labelColors = {
      cyan: 'text-blue-400',
      purple: 'text-purple-400',
      red: 'text-red-400',
      green: 'text-emerald-400',
      orange: 'text-amber-400',
    };

    return (
      <div className="space-y-3">
        {label && (
          <label className={`block text-sm font-semibold ${labelColors[glowColor]} tracking-wide`}>
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full px-6 py-4 bg-white/[0.02] backdrop-blur-xl border rounded-xl
              font-medium text-white placeholder-gray-400
              transition-all duration-300 ease-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
              hover:bg-white/[0.04]
              ${glowClasses[glowColor]}
              ${error ? 'border-red-500/50 focus:border-red-400' : ''}
              ${className}
            `}
            {...props}
          />
          
          {/* Glass effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] opacity-50 rounded-xl pointer-events-none" />
          
          {/* Focus indicator */}
          <div className={`absolute inset-0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none ${glowClasses[glowColor].includes('blue') ? 'bg-blue-400/5' : glowClasses[glowColor].includes('purple') ? 'bg-purple-400/5' : glowClasses[glowColor].includes('red') ? 'bg-red-400/5' : glowClasses[glowColor].includes('emerald') ? 'bg-emerald-400/5' : 'bg-amber-400/5'}`} />
        </div>
        {error && (
          <p className="text-red-400 text-sm font-medium flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-xs">!</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

CyberpunkInput.displayName = 'CyberpunkInput';