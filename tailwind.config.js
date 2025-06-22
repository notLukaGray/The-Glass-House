import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#582973",
        secondary: "#FFFFFF",
        accent: "#E813A4",
        background: "#F4E3FF",
        text: "#09020D",
        // Add more as needed from your theme
      },
      fontFamily: {
        heading: ["system-ui", "sans-serif"],
        body: ["system-ui", "sans-serif"],
        compressa: ["CompressaPRO-GX.woff2", "sans-serif"],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "2rem",
        xl: "3rem",
      },
    },
  },
  plugins: [typography],
};

export default config;
