// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import authSlice untuk login
import productReducer from './slices/productSlice'; // Import productSlice untuk product

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer  // Menggunakan authReducer di store
    // Tambahkan reducer lain seperti product atau cart jika ada
  },
});

export default store;
