module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      gradientColorStops: {
        'start-gradient': '#5B13C4',
        'mid-gradient': '#2A0B62', 
        'end-gradient': '#121212',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'dark-bg': '#121212'
      },
      colors: {
        'button-blue': '#3456D4',
        'fill-input': 'rgba(217, 217, 217, 0.2)',
        'stroke-input': '#FFFFFF'
      }
    },
  },
  plugins: [],
}
