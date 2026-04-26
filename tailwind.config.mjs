/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        electric: {
          300: '#fde68a',
          400: '#facc15',
          500: '#eab308',
        },
        surface: {
          950: '#04040a',
          900: '#080810',
          800: '#0f0f1a',
          700: '#14142a',
          600: '#1a1a3a',
          500: '#22224a',
          glass: 'rgba(20, 20, 42, 0.55)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(6,182,212,0.15) 100%)',
        'aurora-gradient': 'linear-gradient(125deg, #6366f1 0%, #8b5cf6 25%, #06b6d4 55%, #22d3ee 100%)',
        'dark-gradient': 'linear-gradient(135deg, #080810 0%, #14142a 100%)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        'spotlight': 'radial-gradient(circle 600px at var(--mx,50%) var(--my,50%), rgba(99,102,241,0.18), transparent 60%)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\'/%3E%3CfeColorMatrix values=\'0 0 0 0 0.4 0 0 0 0 0.4 0 0 0 0 0.4 0 0 0 0.18 0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
      },
      backgroundSize: {
        'grid': '64px 64px',
        'grid-sm': '32px 32px',
      },
      boxShadow: {
        'glow-brand': '0 0 60px -15px rgba(99,102,241,0.6)',
        'glow-cyan': '0 0 60px -15px rgba(34,211,238,0.55)',
        'glow-soft': '0 10px 60px -10px rgba(99,102,241,0.35)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
        'card-hover': '0 30px 80px -20px rgba(99,102,241,0.45)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'aurora': 'aurora 14s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'tilt': 'tilt 10s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      blur: {
        '4xl': '120px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
