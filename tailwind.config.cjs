/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lgp-green": "#779F56",
        "lgp-orange-dark": "#AF4F35",
        "lgp-red-dark": "#401317",

        "lgp-orange-light": "#FFDEBC",

        "lgp-gradient-orange-light": "#F5B27E",
        "lgp-gradient-orange-dark": "#DE6F52",
      },
      fontFamily: {
        main: "Montserrat",
      },
    },
  },
  plugins: [],
};

module.exports = config;
