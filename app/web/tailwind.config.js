/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Wine/cream family sourced from mg-vinho / mg-ivory / mg-ink / mg-magenta / mg-indigo
        primary: "#40101E", // mg-vinho
        secondary: "#E040A0", // mg-magenta
        surface: "#F0F0E8", // mg-ivory
        "surface-1": "#F0F0E8", // mg-ivory
        "surface-2": "#EAE7E2", // ivory family (mockup surface)
        "on-surface-variant": "#141414", // mg-ink
        outline: "#E4E2DE", // ivory family (mockup border)
        paper: "#F0F0E8", // mg-ivory
        ink: "#141414", // mg-ink
        ledger: "#2F4A3C",
        "navy-deep": "#0A0E1A",
        "navy-mid": "#101628",
        "navy-card": "#161D32",
        "navy-row": "#1C243C",
        "navy-line": "#2C3550",
        mist: "#C5CBD8",
        deny: "#8B3A3A",
        void: "#0B0B0C",
        "void-mid": "#141416",
        "void-card": "#1C1C1F",
        "void-line": "#2E2E33",
        ivory: "#F6F3EC",
        "ivory-2": "#EBE6DA",
        "ivory-ink": "#161513",
        ember: "#2A2118",
        ctrl: "#4F46E5",
        "ctrl-deep": "#3730A3",
        flare: "#E11D48",
        dusk: "#6D28D9",
        amberfield: "#EA580C",
        "mg-ivory": "#F0F0E8",
        "mg-ink": "#141414",
        "mg-indigo": "#5060E0",
        "mg-magenta": "#E040A0",
        "mg-blue": "#5090F0",
        "mg-warm": "#E08070",
        "mg-vinho": "#40101E",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Cabinet Grotesk", "Geist", "Inter", "system-ui", "sans-serif"],
        ui: ["Geist", "Inter", "system-ui", "sans-serif"],
        "theme-body": ["Hanken Grotesk", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        "theme-display": ["Figtree", "Cabinet Grotesk", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
