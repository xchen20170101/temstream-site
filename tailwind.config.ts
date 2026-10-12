import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#06070d',
          surface: '#0d1019',
          elevated: '#141826',
        },
        neon: {
          violet: '#8b5cf6',
          cyan: '#22d3ee',
          pink: '#ec4899',
          green: '#34d399',
          // 预装盒子板块专用琥珀色调：与广域网（violet）、局域网（cyan）
          // 拉开视觉距离，让"硬件独占"在站内一眼可辨。
          amber: '#f59e0b',
          'amber-soft': '#fbbf24',
          'amber-deep': '#b45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.18), transparent 60%)',
        'hero-radial':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.18), transparent 70%)',
      },
      boxShadow: {
        neon: '0 0 30px -5px rgba(139, 92, 246, 0.45)',
        'neon-cyan': '0 0 30px -5px rgba(34, 211, 238, 0.55)',
        // 预装盒子板块专用阴影：与 cyan/violet 平行但走暖色光谱，
        // 在深色底色上以琥珀光晕突出"硬件专属"调性。
        'neon-amber': '0 0 30px -5px rgba(245, 158, 11, 0.55)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 3.5s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;