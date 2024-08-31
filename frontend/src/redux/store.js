// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import cartReducer from './slices/cartSlice';
import cartSaveReducer from './slices/cartSaveSlice';
import viewReducer from './slices/viewSlice'; // Import viewSlice
import paymentReducer from './slices/paymentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    carts: cartReducer,
    cartSave: cartSaveReducer,
    view: viewReducer, // Tambahkan viewReducer
    payment: paymentReducer,
  },
});

export default store;
