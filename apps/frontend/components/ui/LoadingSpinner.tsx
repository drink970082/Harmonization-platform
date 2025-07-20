'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'red' | 'green' | 'orange';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'cyan',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  const colorClasses = {
    cyan: 'border-cyan-400',
    purple: 'border-purple-400',
    red: 'border-red-400',
    green: 'border-green-400',
    orange: 'border-orange-400',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`
            ${sizeClasses[size]} ${colorClasses[color]}
            border-4 border-t-transparent rounded-full animate-spin
          `}
        />
        {/* Inner ring - counter rotation */}
        <div
          className={`
            absolute inset-2 ${colorClasses[color]}
            border-2 border-b-transparent rounded-full animate-spin
          `}
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
        {/* Center dot */}
        <div
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-2 h-2 ${colorClasses[color].replace('border', 'bg')} rounded-full animate-pulse
          `}
        />
      </div>
      {text && (
        <p className="text-cyan-400 font-mono text-sm uppercase tracking-wider animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};