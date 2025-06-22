/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Pour les fichiers dans src/app/ (Next.js app router)
    './src/pages/**/*.{js,ts,jsx,tsx}', // Pour les pages dans pages/
    './src/components/**/*.{js,ts,jsx,tsx}', // Pour les composants réutilisables
  ],
  theme: {
    extend: {}, // Extension possible du thème Tailwind ici
  },
  plugins: [], // Plugins Tailwind éventuels
};
