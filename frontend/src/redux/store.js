// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import authSlice untuk login
import productReducer from './slices/productSlice'; // Import productSlice untuk product
import categoryReducer from './slices/categorySlice'; // Import categorySlice untuk kategori
import cartReducer from './slices/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    carts: cartReducer
    // Menggunakan authReducer di store
    // Tambahkan reducer lain seperti product atau cart jika ada
  },
});

export default store;
