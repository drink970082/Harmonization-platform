'use client';

import React, { useEffect, useState } from 'react';
import { MatrixRain } from './MatrixRain';

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export const CyberpunkBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 只在客戶端生成粒子
    const generatedParticles: Particle[] = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    
    setParticles(generatedParticles);
  }, []);

  // 服務器端渲染時不顯示粒子，避免水合錯誤
  if (!mounted) {
    return (
      <>
        <MatrixRain />
        <div className="cyberpunk-bg" />
      </>
    );
  }

  return (
    <>
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      {/* Grid Background */}
      <div className="cyberpunk-bg" />
      
      {/* Floating particles - 只在客戶端渲染 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: particle.left + '%',
              top: particle.top + '%',
              animation: `float ${particle.duration}s linear infinite`,
              animationDelay: particle.delay + 's',
            }}
          />
        ))}
      </div>
    </>
  );
};