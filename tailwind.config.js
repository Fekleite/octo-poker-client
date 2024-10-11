/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat'],
        'display': ['Anton']
      },
      keyframes: {
        'fade-in': {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        }
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in',
      }
    },
  },
  plugins: [],
}

