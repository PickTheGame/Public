/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./Public/index.html'],
  theme: {
    extend: {
      colors: {
        ink: '#0d1b2a',
        cream: '#f8f9fe',
        gold: '#EFB71E',
        field: '#202B5F',
        smoke: '#EEF0F8',
        secondary: {
          100: '#F9E7B2',
          300: '#F3C549',
          500: '#EFB71E',
          700: '#C79719'
        },
        brand: {
          DEFAULT: '#202B5F',
          50: '#EEF0F8',
          100: '#D7DBEE',
          200: '#9EA9D0',
          300: '#5E6AA0',
          400: '#414D80',
          500: '#202B5F',
          600: '#1D2857',
          700: '#1A224F',
          800: '#161D47',
          900: '#131A3F'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(7, 18, 32, 0.16)'
      }
    }
  }
};
