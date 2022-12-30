/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#F2F2F2",
      black: "#0F0F0F",
      "dark-gray": "#16181C",
      gray: "#71767B",
      "dark-blue": "#023E7D",
      brand: "#1D9BF0",
      gold: "#CCA000",
      "light-gold": "#F5CC00",
    },
    boxShadow: {
      sm: "0px 2px 4px 0px rgba(11, 10, 55, 0.15)",
      lg: "0px 8px 20px 0px rgba(18, 16, 99, 0.06)",
    },
    fontSize: {
      "3xs": ["0.55rem", { lineHeight: "1.2rem", letterSpacing: "-0.03em" }],
      "2xs": ["0.7rem", { lineHeight: "1.3rem", letterSpacing: "-0.03em" }],
      xs: ["0.875rem", { lineHeight: "1.5rem", letterSpacing: "-0.03em" }],
      sm: ["1rem", { lineHeight: "1.75rem", letterSpacing: "-0.03em" }],
      md: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.03em" }],
      lg: ["1.5rem", { lineHeight: "2.25rem", letterSpacing: "-0.03em" }],
      xl: ["2.25rem", { lineHeight: "3rem", letterSpacing: "-0.032em" }],
      "2xl": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.032em" }],
      "3xl": ["3.5rem", { lineHeight: "4rem", letterSpacing: "-0.032em" }],
      "4xl": ["5rem", { lineHeight: "5rem", letterSpacing: "-0.032em" }],
    },
    fontFamily: { sans: ["var(--font-satoshi)"] },
    extend: {},
  },
  plugins: [],
};
