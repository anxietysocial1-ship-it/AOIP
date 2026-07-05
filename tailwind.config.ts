import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f1f5fb",
          100: "#dde7f4",
          200: "#c1d3ea",
          300: "#96b5da",
          400: "#6490c6",
          500: "#4173b0",
          600: "#305a94",
          700: "#284978",
          800: "#243e64",
          900: "#0b1b33",
          950: "#050d1a",
        },
        saffron: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc071",
          400: "#ff9933",
          500: "#fd7e14",
          600: "#ee620a",
          700: "#c54a0b",
          800: "#9c3b11",
          900: "#7e3212",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Noto Sans",
          "Noto Sans Devanagari",
          "Noto Sans Bengali",
          "Noto Sans Tamil",
          "Noto Sans Telugu",
          "Noto Sans Kannada",
          "Noto Sans Malayalam",
          "Noto Sans Gurmukhi",
          "Noto Sans Gujarati",
          "Noto Sans Oriya",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        "glow-pulse": "glow-pulse 8s ease-in-out infinite alternate",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          from: { opacity: "0.5", transform: "scale(1)" },
          to: { opacity: "0.9", transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
