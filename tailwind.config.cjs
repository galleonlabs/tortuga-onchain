const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["monospace", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "theme-yellow": "#F9CE0E",
        "theme-gray": "#202020",
      },
    },
  },
  plugins: [],
};
