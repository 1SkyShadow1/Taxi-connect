/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{html,js,ts,jsx,tsx}',
    './components/**/*.{html,js,ts,jsx,tsx}',
    './lib/**/*.{html,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#fec9aa',
          300: '#fda776',
          400: '#fc7a3a',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        secondary: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#b7dcff',
          300: '#84c5ff',
          400: '#42a4ff',
          500: '#0d83ff',
          600: '#0063db',
          700: '#004caf',
          800: '#003f90',
          900: '#00326f'
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      boxShadow: {
        'soft': '0 4px 12px -2px rgba(0,0,0,0.06)',
        'elevated': '0 6px 20px -2px rgba(0,0,0,0.12)'
      }
    },
  },
  plugins: [],
}

