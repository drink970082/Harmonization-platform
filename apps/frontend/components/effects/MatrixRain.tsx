'use client';

import React, { useEffect, useRef, useState } from 'react';

export const MatrixRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 只在客戶端掛載後運行
    if (!mounted) return;
    
    const container = containerRef.current;
    if (!container) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|\\:;";\'<>?,./`~';
    
    const createRainDrop = () => {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = chars[Math.floor(Math.random() * chars.length)] || '0';
      char.style.left = Math.random() * 100 + '%';
      char.style.animationDelay = Math.random() * 10 + 's';
      char.style.animationDuration = (Math.random() * 5 + 5) + 's';
      
      container.appendChild(char);

      // Remove the character after animation
      setTimeout(() => {
        if (char.parentNode) {
          char.parentNode.removeChild(char);
        }
      }, 10000);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to create a new drop
        createRainDrop();
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [mounted]);

  return <div ref={containerRef} className="matrix-container" />;
};