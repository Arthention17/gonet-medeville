import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: "#B5935A",
        "gold-light": "#D4C5A9",
        ink: "#111111",
        cream: "#FAF9F6",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Instrument Sans", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
