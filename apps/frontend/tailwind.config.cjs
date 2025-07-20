/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#000308',
          secondary: '#0a0a0f',
          cyan: '#22d3ee',
          purple: '#a855f7',
          orange: '#fb923c',
          green: '#22c55e',
          red: '#ef4444',
        },
      },
      fontFamily: {
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #000308 0%, #0f0f23 50%, #000308 100%)',
        'matrix-grid': `
          linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
        `,
      },
      animation: {
        'matrix-rain': 'matrix-rain 10s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'scan-line': 'scan-line 2s infinite',
        'glitch': 'glitch 0.3s',
        'float': 'float 20s linear infinite',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'scan-line': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'float': {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.3' },
          '90%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' },
        },
      },
      boxShadow: {
        'cyber-glow': '0 0 20px rgba(34, 211, 238, 0.5)',
        'cyber-glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'cyber-glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'cyber-glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'cyber-glow-orange': '0 0 20px rgba(251, 146, 60, 0.5)',
      },
    },
  },
  plugins: [],
};