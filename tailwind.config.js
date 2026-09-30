/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        white: 'rgb(var(--c-fg) / <alpha-value>)',
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
        },
        badge: {
          green: 'rgb(var(--b-green))',
          purple: 'rgb(var(--b-purple))',
          amber: 'rgb(var(--b-amber))',
          sky: 'rgb(var(--b-sky))',
          gold: 'rgb(var(--b-gold))',
          azure: 'rgb(var(--b-azure))',
        },
        macaw: { DEFAULT: '#3CC8F0', deep: '#1E7FD6' },
        sun: { DEFAULT: '#FFB627', deep: '#FF8A1F' },
        leaf: { DEFAULT: '#6ED04F', deep: '#2E9B4A' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(6vw,-4vh,0) scale(1.15)' },
          '100%': { transform: 'translate3d(-5vw,5vh,0) scale(.95)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(-1.5deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1.5deg)' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        ping2: {
          '0%': { transform: 'scale(1)', opacity: '.7' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        rise: {
          from: { transform: 'translateY(115%) rotate(6deg)', opacity: '0' },
          to: { transform: 'translateY(0) rotate(0)', opacity: '1' },
        },
        drop: {
          '0%': { transform: 'translateY(-140px) rotate(-14deg)', opacity: '0' },
          '60%': { transform: 'translateY(8px) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) rotate(0)', opacity: '1' },
        },
        shine: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        caret: { '50%': { opacity: '0' } },
      },
      animation: {
        drift: 'drift 24s ease-in-out infinite alternate',
        'drift-slow': 'drift 34s ease-in-out infinite alternate-reverse',
        float: 'float 7s ease-in-out infinite',
        bob: 'bob 5s ease-in-out infinite',
        sway: 'sway 6s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        ping2: 'ping2 2s cubic-bezier(0,0,.2,1) infinite',
        shine: 'shine 6s linear infinite',
        caret: 'caret 1s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
