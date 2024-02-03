/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [require("@tailwindcss/forms"), require("rippleui")],
  rippleui: {
    themes: [
      {
        themeName: "light",
        colorScheme: "light",
        colors: {
          primary: "#0069ed",
          secondary: "#042A2B"
        }
      },
      {
        themeName: "dark",
        colorScheme: "dark",
        colors: {
          primary: "#0069ed",
          secondary: "#F4E04D"
        }
      }
    ]
  }
}
