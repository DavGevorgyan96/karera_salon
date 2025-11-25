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
        primary: "#9e8e82", // Muted Taupe - less pink, more neutral
        secondary: "#e8e6e1", // Warm Gray - significantly darker than off-white to reduce glare
        accent: "#8c7b70", // Darker Taupe
        dark: "#262626", // Slightly darker charcoal
        light: "#f0f0f0", // Soft gray
        surface: "#fcfbf9", // Soft off-white for cards
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
    },
  },
  plugins: [],
};
export default config;
