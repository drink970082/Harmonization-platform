'use client';

import React from 'react';

interface CyberpunkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

export const CyberpunkButton: React.FC<CyberpunkButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
}) => {
  const baseClasses = `
    relative overflow-hidden font-semibold tracking-wide
    border transition-all duration-300 ease-out transform
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    backdrop-blur-sm rounded-xl
    group
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-blue-300
      hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400 hover:text-blue-200
      hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]
      focus:ring-blue-500/50
    `,
    secondary: `
      bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 text-purple-300
      hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400 hover:text-purple-200
      hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]
      focus:ring-purple-500/50
    `,
    danger: `
      bg-gradient-to-r from-red-600/20 to-orange-600/20 border-red-500/50 text-red-300
      hover:from-red-500/30 hover:to-orange-500/30 hover:border-red-400 hover:text-red-200
      hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]
      focus:ring-red-500/50
    `,
    success: `
      bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-emerald-500/50 text-emerald-300
      hover:from-emerald-500/30 hover:to-green-500/30 hover:border-emerald-400 hover:text-emerald-200
      hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]
      focus:ring-emerald-500/50
    `,
  };

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Glass effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-50 rounded-xl" />
      
      <span className="relative z-10 flex items-center justify-center gap-3">
        {loading && (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </span>
    </button>
  );
};