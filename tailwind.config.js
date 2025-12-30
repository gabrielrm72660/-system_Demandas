/** @type {import('tailwindcss').Config} */
export default {
  // Isso avisa ao sistema para ativar o modo escuro quando encontrar a classe "dark" no HTML
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Aqui garantimos que o indigo e o slate funcionem bem
    },
  },
  plugins: [],
}
