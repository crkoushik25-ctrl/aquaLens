/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#030712',
          900: '#070f1e',
          850: '#0b162c',
          800: '#0f1f38',
          750: '#142a4b',
          700: '#1a375f',
          600: '#224a7e',
        },
        sonar: {
          cyan: '#00f2fe',
          teal: '#06b6d4',
          blue: '#4facfe',
          amber: '#f59e0b',
          gold: '#fbbf24',
          emerald: '#10b981',
          orange: '#f97316',
          crimson: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'sonar-ping': 'sonarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'waterfall-scan': 'waterfallScan 6s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        sonarPing: {
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        waterfallScan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
