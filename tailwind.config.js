/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/shared/components/**/*.{js,ts,tsx}',
    './src/app/**/*.{js,ts,tsx}',
    './src/features/*/{components,screens}/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
