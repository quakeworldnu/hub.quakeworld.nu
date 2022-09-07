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
        "servers": "repeat(auto-fill, minmax(330px, 1fr))"
      }
    },
  },
  plugins: [],
}
