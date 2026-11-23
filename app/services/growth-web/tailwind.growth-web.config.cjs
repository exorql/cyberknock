/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/services/growth-web/**/*.{ts,tsx}",
    "./components/growth-web/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
}
