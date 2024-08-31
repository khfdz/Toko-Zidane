// src/redux/slices/paymentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    totalPrice: 0,
  },
  reducers: {
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
  },
});

export const { setTotalPrice } = paymentSlice.actions;
export default paymentSlice.reducer;
