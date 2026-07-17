import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bizztob brand — blue leaning towards purple gradient
        brand: {
          50: "#eff0ff",
          100: "#e2e3ff",
          200: "#c9caff",
          300: "#a5a5fe",
          400: "#807efc",
          500: "#4a45fe", // primary blue
          600: "#3f39ee",
          700: "#332dcf",
          800: "#2b28a4",
          900: "#252382",
          950: "#171555",
        },
        violet: {
          500: "#7d33f9",
          600: "#6f22ec",
          700: "#5e17c9",
        },
        canvas: "#f5f5fb", // body background
        surface: "#ffffff",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Inter",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 4px 12px rgba(16, 24, 40, 0.06)",
        soft: "0 4px 24px rgba(16, 24, 40, 0.06)",
        pill: "0 6px 16px rgba(74, 69, 254, 0.35)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(90deg, #4A45FE 0%, #7D33F9 100%)",
        "brand-gradient-r":
          "linear-gradient(90deg, #7D33F9 0%, #4A45FE 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
