/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    fontFamily: {
      sans: "Roboto, Helvetica, Arial, sans-serif",
      mono: "monospace",
    },
    extend: {
      gridTemplateColumns: {
        "servers": "repeat(auto-fill, minmax(380px, 1fr))"
      }
    },
  },
  plugins: [],
}
