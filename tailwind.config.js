/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Serene Scholar (keep existing token names for compatibility)
        bg:       '#f7f9fb', // background
        surface:  '#ffffff', // surface-container-lowest
        surface2: '#f2f4f6', // surface-container-low
        border:   '#c7c4d7', // outline-variant

        // Text helpers (new, optional)
        ink:      '#191c1e', // on-surface
        muted:    '#464554', // on-surface-variant
        outline:  '#767586', // outline

        // Brand + role colors
        accent:   '#4648d4', // primary
        purple:   '#8127cf', // secondary
        blue:     '#0058be', // tertiary
        teal:     '#14b8a6', // kept for buddy accents (not in palette, but used in UI)

        // Status
        danger:   '#ba1a1a', // error
        success:  '#22c55e',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        // subtle, calm backgrounds
        'gold-gradient': 'linear-gradient(135deg, rgba(70,72,212,1) 0%, rgba(129,39,207,1) 100%)',
        'surface-gradient': 'linear-gradient(135deg, #ffffff 0%, #f7f9fb 100%)',
        'serene-bg': 'radial-gradient(1200px 600px at 15% 10%, rgba(96,99,238,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(900px 500px at 90% 15%, rgba(33,112,228,0.10) 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, #f7f9fb 0%, #f7f9fb 100%)',
      },
      boxShadow: {
        // Ambient, softly tinted elevation
        'glow': '0 0 20px rgba(70, 72, 212, 0.14)',
        'glow-lg': '0 0 48px rgba(70, 72, 212, 0.18)',
        'card': '0 18px 50px rgba(70, 72, 212, 0.08)',
        'card2': '0 24px 70px rgba(25, 28, 30, 0.08)',
      }
    },
  },
  plugins: [],
};
