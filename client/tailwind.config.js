/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steam-dark': '#1b2838',
        'steam-blue': '#66c0f4',
        'steam-light-blue': '#91c9ff',
      },
    },
  },
  plugins: [],
}


