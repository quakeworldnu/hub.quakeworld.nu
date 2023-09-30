const { blackA, violet } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: "Roboto, Helvetica, Arial, sans-serif",
      mono: "monospace",
    },
    extend: {
      colors: {
        ...blackA,
        ...violet,
      },
      gridTemplateColumns: {
        servers: "repeat(auto-fill, minmax(340px, 1fr))",
      },
      screens: {
        "3xl": "1890px",
      },
      transitionProperty: {
        size: "width, height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
