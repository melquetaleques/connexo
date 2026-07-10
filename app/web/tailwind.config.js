/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000830",
        secondary: "#C59D5C",
        surface: "#F9FAFB",
        "surface-2": "#F3F4F6",
        "on-surface-variant": "#4B5563",
        outline: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
