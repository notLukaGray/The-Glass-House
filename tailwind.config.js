import typography from "@tailwindcss/typography";

const config = {
  content: [
    "./src/components*.{js,ts,jsx,tsx,mdx}",
    "./src/app*.{js,ts,jsx,tsx,mdx}",
    "./src/lib*.{js,ts,jsx,tsx,mdx}",
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
      },
      fontFamily: {
        heading: ["system-ui", "sans-serif"],
        body: ["system-ui", "sans-serif"],
        compressa: ["CompressaPRO", "sans-serif"],
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
