module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D1B2A',
        cream: '#F8F9FE',
        primary: {
          50: '#EEF0F8',
          100: '#D7DBEE',
          200: '#9EA9D0',
          300: '#5E6AA0',
          400: '#414D80',
          500: '#202B5F',
          600: '#1D2857',
          700: '#1A224F',
          800: '#161D47',
          900: '#131A3F',
        },
        secondary: {
          100: '#F9E7B2',
          300: '#F3C549',
          500: '#EFB71E',
          700: '#C79719',
        },
        tertiary: {
          300: '#864147',
          500: '#5F202B',
          700: '#4A1A26',
        },
        error: {
          100: '#FADADA',
          500: '#D32F2F',
          700: '#B71C1C',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
        display: ['Barlow Condensed', 'Arial Narrow', 'sans-serif'],
      },
      fontSize: {
        tiny: '0.688rem',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
