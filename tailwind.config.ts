import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        spaceGrotesk: ['"Space Grotesk"', 'sans-serif'],
        montserrat: ['Montserrat Subrayada', 'sans-serif'],
        spaceMono: ['Space Mono', 'monospace'],
      },

      colors: {
        light: "#FDFDFD",
        dark: "#282828",
        subtitle: "#B2B2B2",
        primeRed: "#E63946",
        primeRedDark: "#CF2832",
        primeBlue: "#34D4C8",
        primeBlueDark: "#21afb1",
      },
    },
  },
  plugins: [],
};
export default config;
