/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./containers/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "discord-bg": "#1e1f22",
        "discord-primary": "#5865F2",
        "discord-accent": "#4752C4",
        "discord-text": "#f2f3f5",
        "discord-muted": "#b9bbbe",
        "discord-danger": "#ED4245",
        "discord-success": "#3BA55D",
      },
    },
  },
  plugins: [],
};
