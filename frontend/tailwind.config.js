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
        warna4: '#FFFFFF',
        warna5: '#504D4C',
        // Add opacity variations for warna1
        warna1op1: 'rgba(144, 77, 61, 0.1)', // 10%
        warna1op2: 'rgba(144, 77, 61, 0.2)', // 20%
        warna1op3: 'rgba(144, 77, 61, 0.3)', // 30%
        warna1op4: 'rgba(144, 77, 61, 0.4)', // 40%
        warna1op5: 'rgba(144, 77, 61, 0.5)', // 50%
        warna1op6: 'rgba(144, 77, 61, 0.6)', // 60%
        warna1op7: 'rgba(144, 77, 61, 0.7)', // 70%
        warna1op8: 'rgba(144, 77, 61, 0.8)', // 80%
        warna1op9: 'rgba(144, 77, 61, 0.9)', // 90%
        // Add opacity variations for warna3
        warna3op1: 'rgba(255, 170, 60, 0.1)', // 10%
        warna3op2: 'rgba(255, 170, 60, 0.2)', // 20%
        warna3op3: 'rgba(255, 170, 60, 0.3)', // 30%
        warna3op4: 'rgba(255, 170, 60, 0.4)', // 40%
        warna3op5: 'rgba(255, 170, 60, 0.5)', // 50%
        warna3op6: 'rgba(255, 170, 60, 0.6)', // 60%
        warna3op7: 'rgba(255, 170, 60, 0.7)', // 70%
        warna3op8: 'rgba(255, 170, 60, 0.8)', // 80%
        warna3op9: 'rgba(255, 170, 60, 0.9)', // 90%
      },
      keyframes: {
        enlarge: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        enlarge: 'enlarge 0.2s ease-in-out',
      },
    },
  },
  plugins: [],
};
