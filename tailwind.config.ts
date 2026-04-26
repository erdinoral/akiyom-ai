import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#F5F5F5",
        hairline: "#ffffff1a",
        accent: {
          blue: "#8ca1ff",
          violet: "#b78dff",
        },
      },
      borderColor: {
        hairline: "#ffffff1a",
      },
      boxShadow: {
        focusGlow:
          "0 0 0 1px rgba(255,255,255,0.22), 0 0 26px rgba(140,161,255,0.18)",
      },
      maxWidth: {
        chat: "48rem",
      },
      letterSpacing: {
        widestPlus: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
