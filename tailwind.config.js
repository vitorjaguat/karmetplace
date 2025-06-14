/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--inter-font)'],
      },
      colors: {
        'sph-purple-light': '#A0A0FF',
        'sph-green': '#01ff00',
      },
    },
  },
  plugins: [],
}
