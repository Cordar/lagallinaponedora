/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lgp-green": "#779F56",
        "lgp-orange-dark": "#1B1500",
        "lgp-red-dark": "#401317",

        "lgp-orange-light": "#FFF1A8",

        "lgp-gradient-orange-light": "#FFE667",
        "lgp-gradient-orange-dark": "#ffc244",
      },
      fontFamily: {
        main: "Montserrat",
      },
    },
  },
  plugins: [],
};

module.exports = config;
