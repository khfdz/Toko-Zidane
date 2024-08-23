/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warna1: '#904D3D',
        warna2: '#FFEEC1',
        warna3: '#FFAA3C',
        warna4: '#FFFFFF'
      },
    },
  },
  plugins: [],
}
