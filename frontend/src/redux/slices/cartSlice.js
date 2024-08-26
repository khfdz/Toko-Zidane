import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCartForCurrentUser,
  addItemsToCart,
  fetchAllCarts,
  fetchCartById,
  deleteCartById,
  editCartById
} from '../api/cartApiService';

// Async thunks
export const fetchCartForCurrentUserThunk = createAsyncThunk('cart/fetchForCurrentUser', async () => {
  const response = await fetchCartForCurrentUser();
  return response;
});

export const addItemsToCartThunk = createAsyncThunk('cart/addItems', async (items) => {
  const response = await addItemsToCart(items);
  return response;
});

export const fetchAllCartsThunk = createAsyncThunk('cart/fetchAllCarts', async () => {
  const response = await fetchAllCarts();
  return response;
});

export const fetchCartByIdThunk = createAsyncThunk('cart/fetchById', async (id) => {
  const response = await fetchCartById(id);
  return response;
});

export const deleteCartByIdThunk = createAsyncThunk('cart/deleteById', async (id) => {
  await deleteCartById(id);
  return id;
});

export const editCartByIdThunk = createAsyncThunk('cart/editById', async ({ id, items }) => {
  const response = await editCartById(id, items);
  return response;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    currentCart: null,
    allCarts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchCartForCurrentUserThunk
      .addCase(fetchCartForCurrentUserThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartForCurrentUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCart = action.payload;
      })
      .addCase(fetchCartForCurrentUserThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Handle addItemsToCartThunk
      .addCase(addItemsToCartThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemsToCartThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.currentCart) {
          state.currentCart.items = action.payload.items;
        }
      })
      .addCase(addItemsToCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle fetchAllCartsThunk
      .addCase(fetchAllCartsThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCartsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allCarts = action.payload;
      })
      .addCase(fetchAllCartsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle fetchCartByIdThunk
      .addCase(fetchCartByIdThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCart = action.payload;
      })
      .addCase(fetchCartByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle deleteCartByIdThunk
      .addCase(deleteCartByIdThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCartByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allCarts = state.allCarts.filter(cart => cart._id !== action.payload);
        if (state.currentCart && state.currentCart._id === action.payload) {
          state.currentCart = null;
        }
      })
      .addCase(deleteCartByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle editCartByIdThunk
      .addCase(editCartByIdThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editCartByIdThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (state.currentCart && state.currentCart._id === action.payload._id) {
          state.currentCart = action.payload;
        }
      })
      .addCase(editCartByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
