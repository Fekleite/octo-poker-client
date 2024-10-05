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
        },
        'fade-in-up': {
          "0%": {
            opacity: 0,
            transform: "translateY(40px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 1s ease-in',
        'fade-in': 'fade-in 1s ease-in',
      }
    },
  },
  plugins: [],
}

