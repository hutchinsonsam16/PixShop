/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./state/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}