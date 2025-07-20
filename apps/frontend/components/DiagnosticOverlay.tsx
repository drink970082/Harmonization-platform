'use client';

import React, { useEffect, useState } from 'react';

export const DiagnosticOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [containerInfo, setContainerInfo] = useState<any>({});

  useEffect(() => {
    const checkLayout = () => {
      const containers = document.querySelectorAll('[class*="center"], [class*="max-w"], [class*="mx-auto"]');
      const info: any = {};
      
      containers.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        info[`container-${index}`] = {
          element: el.className,
          left: rect.left,
          width: rect.width,
          marginLeft: computedStyle.marginLeft,
          marginRight: computedStyle.marginRight,
          display: computedStyle.display,
          alignItems: computedStyle.alignItems,
          justifyContent: computedStyle.justifyContent,
        };
      });
      
      setContainerInfo(info);
    };

    if (isVisible) {
      checkLayout();
      const interval = setInterval(checkLayout, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Toggle with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsVisible(true)}
          className="bg-red-500/80 text-white px-3 py-1 rounded text-sm font-mono"
        >
          Debug Layout
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 overflow-auto">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Layout Diagnostic</h2>
          <button 
            onClick={() => setIsVisible(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
        
        <div className="space-y-4 text-sm font-mono text-white">
          <div>
            <h3 className="text-lg font-semibold mb-2">Viewport Info:</h3>
            <p>Window Width: {window.innerWidth}px</p>
            <p>Window Height: {window.innerHeight}px</p>
            <p>Device Pixel Ratio: {window.devicePixelRatio}</p>
            <p>User Agent: {navigator.userAgent.includes('Mac') ? 'macOS' : 'Other'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Container Analysis:</h3>
            {Object.entries(containerInfo).map(([key, info]: [string, any]) => (
              <div key={key} className="border border-gray-600 rounded p-3 mb-2">
                <p className="text-yellow-300">Element: {info.element}</p>
                <p>Left: {info.left.toFixed(2)}px</p>
                <p>Width: {info.width.toFixed(2)}px</p>
                <p>Margin Left: {info.marginLeft}</p>
                <p>Margin Right: {info.marginRight}</p>
                <p>Display: {info.display}</p>
                <p>Align Items: {info.alignItems}</p>
                <p>Justify Content: {info.justifyContent}</p>
                <p className={`${info.left < 50 ? 'text-red-400' : 'text-green-400'}`}>
                  Status: {info.left < 50 ? 'LIKELY OFFSET LEFT' : 'CENTERED'}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/20 rounded">
          <p className="text-blue-200 text-sm">
            Press Ctrl+Shift+D to toggle this overlay. Look for elements with "LIKELY OFFSET LEFT" status.
          </p>
        </div>
      </div>
    </div>
  );
};