/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5F316E',
          dark: '#4A2555',
          light: '#7A4389',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#BEC5C9',
          400: '#9CA3AF',
          500: '#576164',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: {
          DEFAULT: '#005C45',
          light: '#00854A',
        },
        danger: {
          DEFAULT: '#780F2D',
          light: '#C0003C',
        },
        warning: {
          DEFAULT: '#F7BB3D',
          light: '#F9E03A',
        },
        background: '#FFFFFF',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
