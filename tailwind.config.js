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
        terracotta: 'var(--color-terracotta)',
        sage: 'var(--color-sage)',
        warmAmber: 'var(--color-warm-amber)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        ambient: '0 20px 45px -15px rgb(31 58 46 / 0.18)',
        floating: '0 12px 30px -8px rgb(31 58 46 / 0.25)',
      },
    },
  },
  plugins: [],
};
