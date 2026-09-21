/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: 'var(--color-bg)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        alert: 'var(--color-alert)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};
