import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#121212",
        border: "#2A2A2A",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"], // Uses Next.js default font
      },
    },
  },
  plugins: [],
};
export default config;
