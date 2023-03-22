/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: "Montserrat",
      },
    },
  },
  plugins: [],
};

module.exports = config;
