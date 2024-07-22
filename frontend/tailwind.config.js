/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lcarsYellow: {
          100: "#FFFF99",
          200: "#FFCC66",
          300: "#FFCC66",
          400: "#BBAA55",
        },
        lcarsOrange: {
          100: "#FF9900",
          200: "#FF9933",
          300: "#BB6622",
          400: "#BB4411",
        },
        lcarsPurple: {
          100: "#9999FF",
          200: "#9999CC",
          300: "#9977AA",
          400: "#774466",
          500: "#664466",
        },
        lcarsPink: {
          100: "#CC6699",
          200: "#CC99CC",
        },
        lcarsBlue: {
          100: "#CCDDFF",
          200: "#99CCFF",
          300: "#5599FF",
          400: "#6688CC",
          500: "#3366FF",
          600: "#3366CC",
          700: "#0011EE",
          800: "#000088",
        },
        lcarsAqua: "#006699",
        lcarsRed: "#882211",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true, // solve the "sticky hover" issue on iOS devices
  },
  plugins: [],
};
