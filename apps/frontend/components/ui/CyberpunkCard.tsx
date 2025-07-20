'use client';

import React from 'react';

interface CyberpunkCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'red' | 'green' | 'orange';
}

export const CyberpunkCard: React.FC<CyberpunkCardProps> = ({
  children,
  title,
  className = '',
  glowColor = 'cyan',
}) => {
  const glowClasses = {
    cyan: 'border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.25)]',
    purple: 'border-purple-500/30 shadow-[0_0_40px_rgba(147,51,234,0.15)] hover:shadow-[0_0_60px_rgba(147,51,234,0.25)]',
    red: 'border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)] hover:shadow-[0_0_60px_rgba(239,68,68,0.25)]',
    green: 'border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]',
    orange: 'border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:shadow-[0_0_60px_rgba(245,158,11,0.25)]',
  };
  
  const titleColors = {
    cyan: 'text-blue-400',
    purple: 'text-purple-400', 
    red: 'text-red-400',
    green: 'text-emerald-400',
    orange: 'text-amber-400',
  };

  return (
    <div
      className={`
        group relative bg-white/[0.02] backdrop-blur-xl border rounded-2xl
        transition-all duration-500 ease-out hover:scale-[1.01]
        w-full mx-auto flex flex-col
        ${glowClasses[glowColor]}
        ${className}
      `}
      style={{ maxWidth: '100%', margin: '0 auto' }}
    >
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-black/[0.05] rounded-2xl" />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] rounded-2xl"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />
      
      {/* Modern corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 overflow-hidden rounded-tl-2xl">
        <div className={`absolute top-0 left-0 w-full h-0.5 ${titleColors[glowColor]} opacity-60`} />
        <div className={`absolute top-0 left-0 h-full w-0.5 ${titleColors[glowColor]} opacity-60`} />
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden rounded-tr-2xl">
        <div className={`absolute top-0 right-0 w-full h-0.5 ${titleColors[glowColor]} opacity-60`} />
        <div className={`absolute top-0 right-0 h-full w-0.5 ${titleColors[glowColor]} opacity-60`} />
      </div>

      <div className="relative z-10 p-8 lg:p-12 w-full flex flex-col items-center">
        {title && (
          <div className="mb-10 text-center w-full">
            <h3 className={`text-2xl lg:text-3xl font-bold ${titleColors[glowColor]} mb-4 tracking-tight`}>
              {title}
            </h3>
            <div className={`w-20 h-0.5 bg-gradient-to-r from-blue-400 to-transparent mx-auto`}></div>
          </div>
        )}
        <div className="w-full flex flex-col items-center justify-center">
          <div className="space-y-10 w-full flex flex-col items-center">
            {React.Children.map(children, (child, index) => (
              <div key={index} className="w-full flex justify-center items-center">
                <div className="w-full max-w-4xl flex flex-col items-center">
                  {child}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
    </div>
  );
};