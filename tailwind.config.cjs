/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lgp-green": "#779F56",
        "lgp-background": "#FFEDC2",
      },
      fontFamily: {
        main: "Montserrat",
      },
      backgroundImage: {
        chickens: "url('/chickens.jpeg')",
        field: "url('/fondo_gallina.svg')",
      },
    },
  },
  plugins: [],
};

module.exports = config;
