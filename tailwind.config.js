/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      sans: "Roboto, Helvetica, Arial, sans-serif",
      mono: "monospace",
    },
    extend: {
      gridTemplateColumns: {
        servers: "repeat(auto-fill, minmax(332px, 1fr))",
      },
      screens: {
        "3xl": "1890px",
        "4xl": "2000px",
      },
    },
  },
  plugins: [],
};
