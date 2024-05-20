/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#1a202c", // Dark background color
        darkText: "#cbd5e0", // Light text color
        darkBorder: "#2d3748", // Dark border color
      },
    },
  },
  plugins: [],
};
