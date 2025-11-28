import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.tsx",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          surface: "rgba(255, 255, 255, 0.05)", // white/5
          border: "rgba(255, 255, 255, 0.10)",  // white/10
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
