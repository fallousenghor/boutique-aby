/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sable: {
          DEFAULT: "#F7EFE3",
          50: "#FDFBF8",
          100: "#F7EFE3",
          200: "#EFE1CC",
        },
        terracotta: {
          DEFAULT: "#C1502E",
          50: "#FBEAE2",
          400: "#D06A45",
          500: "#C1502E",
          600: "#A33F22",
          700: "#7E3019",
        },
        indigo: {
          DEFAULT: "#1F3A5F",
          400: "#2E5580",
          500: "#1F3A5F",
          600: "#152840",
          700: "#0D1A2B",
        },
        ochre: {
          DEFAULT: "#D9A441",
          400: "#E2B863",
          500: "#D9A441",
          600: "#B5842B",
        },
        ink: {
          DEFAULT: "#2B241D",
          400: "#5C5347",
          500: "#2B241D",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Manrope'", "sans-serif"],
        utility: ["'Space Mono'", "monospace"],
      },
      borderRadius: {
        scallop: "1.5rem",
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(43, 36, 29, 0.12)",
        soft: "0 2px 10px -2px rgba(43, 36, 29, 0.08)",
      },
    },
  },
  plugins: [],
};
