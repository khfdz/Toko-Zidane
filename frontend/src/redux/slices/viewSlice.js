// redux/slices/viewSlice.js
import { createSlice } from '@reduxjs/toolkit';

const viewSlice = createSlice({
  name: 'view',
  initialState: { view: 'product' }, // Set default view
  reducers: {
    setView(state, action) {
      state.view = action.payload;
    },
  },
});

export const { setView } = viewSlice.actions;
export default viewSlice.reducer;
