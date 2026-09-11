/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#14544F",
          dark: "#0B2F2C",
          light: "#269E95",
        },
        gold: {
          DEFAULT: "#D4A574",
          dark: "#B8865A",
        },
        ink: "#424242",
        muted: "#9E9E9E",
        cream: "#F5F1E8",
        surface: "#F5F5F5",
        success: "#4CAF50",
        warn: "#F44336",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        h1: ["3rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "h1-sm": ["2rem", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        h2: ["2.125rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h3: ["1.625rem", { lineHeight: "1.25" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,127,126,0.06), 0 8px 24px -12px rgba(27,127,126,0.18)",
        raised: "0 4px 8px rgba(27,127,126,0.08), 0 16px 40px -16px rgba(27,127,126,0.28)",
      },
      maxWidth: {
        prose: "70ch",
      },
    },
  },
  plugins: [],
};
