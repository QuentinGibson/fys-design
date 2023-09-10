import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      display: "'Staatliches', Arial, sans-serif",
      body: "'Mazius Display', Arial, sans-serif",
      sauce: "'Open Sauce One', Arial, sans-serif",
    },
    colors: {
      primary: "hsl(var(--color-primary) / <alpha-value>)",
      secondary: "hsl(var(--color-secondary) / <alpha-value>)",
      tertiary: "hsl(var(--color-tertiary) / <alpha-value>)",
      transparent: "transparent",
      current: "currentColor",
      red: colors.red,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
  },
  plugins: [],
} satisfies Config;
