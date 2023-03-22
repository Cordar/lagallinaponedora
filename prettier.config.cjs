/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 120,
};

module.exports = config;
