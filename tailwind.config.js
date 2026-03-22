module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // primary brand color (logo orange) and sensible shades
        brand: {
          DEFAULT: '#FF8A00',
          600: '#ff8a00',
          700: '#e06f00',
          800: '#b25500'
        },
        // dark background / contrast color
        'brand-contrast': '#0b0b0b'
      }
    },
  },
  plugins: [],
}
