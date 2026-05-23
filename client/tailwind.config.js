export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        slate: '#334155',
        paper: '#f8fafc',
        accent: '#f97316',
        accentSoft: '#fed7aa',
        teal: '#14b8a6',
      },
      boxShadow: {
        soft: '0 24px 70px -30px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(249, 115, 22, 0.18), transparent 26%), radial-gradient(circle at top right, rgba(20, 184, 166, 0.14), transparent 22%), linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.92))',
      },
    },
  },
  plugins: [],
};
