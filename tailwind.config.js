/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        steady: {
          bgLight: '#F9F9F7',
          bgDark: '#1A1A1C',
          textLight: '#1F2937',
          textDark: '#F9F9F7',
          mutedLight: '#6B7280',
          mutedDark: '#9CA3AF',
          borderLight: '#E5E7EB',
          borderDark: '#374151',
          teal: '#5DA8A8',
          tealHover: '#4E9393',
          tealLight: '#EBF5F5',
          tealDark: '#163333',
          amber: '#D97706',
          coral: '#E11D48',
        }
      },
      boxShadow: {
        'neu-light': '6px 6px 16px #e2e2de, -6px -6px 16px #ffffff',
        'neu-light-sm': '4px 4px 10px #e2e2de, -4px -4px 10px #ffffff',
        'neu-light-lg': '10px 10px 24px #deded8, -10px -10px 24px #ffffff',
        'neu-light-inset': 'inset 4px 4px 8px #e2e2de, inset -4px -4px 8px #ffffff',
        'neu-light-inset-sm': 'inset 2px 2px 5px #e2e2de, inset -2px -2px 5px #ffffff',
        'neu-dark': '6px 6px 16px #131315, -6px -6px 16px #212123',
        'neu-dark-sm': '4px 4px 10px #131315, -4px -4px 10px #212123',
        'neu-dark-lg': '10px 10px 24px #0f0f11, -10px -10px 24px #252528',
        'neu-dark-inset': 'inset 4px 4px 8px #131315, inset -4px -4px 8px #212123',
        'neu-dark-inset-sm': 'inset 2px 2px 5px #131315, inset -2px -2px 5px #212123',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
