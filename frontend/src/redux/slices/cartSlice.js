import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCartForCurrentUser,
  addItemsToCart,
  fetchAllCarts,
  fetchCartById,
  deleteCartById,
  editCartById,
  clearCart
} from '../api/cartApiService';

// Async thunks
export const fetchCartForCurrentUserThunk = createAsyncThunk('carts/fetchForCurrentUser', async () => {
  const response = await fetchCartForCurrentUser();
  return response;
});

export const addItemsToCartThunk = createAsyncThunk('carts/addItems', async (items) => {
  const response = await addItemsToCart(items);
  return response;
});

export const fetchAllCartsThunk = createAsyncThunk('carts/fetchAllCarts', async () => {
  const response = await fetchAllCarts();
  return response;
});

export const fetchCartByIdThunk = createAsyncThunk('carts/fetchById', async (id) => {
  const response = await fetchCartById(id);
  return response;
});

export const deleteCartByIdThunk = createAsyncThunk('carts/deleteById', async (id) => {
  await deleteCartById(id);
  return id;
});

// export const editCartByIdThunk = createAsyncThunk('carts/editById', async ({ id, updates }) => {
//   const response = await editCartById(id, updates);
//   return response;
// });

// export const editCartByIdThunk = createAsyncThunk('carts/editById', async ({ id, updates }) => {
//   console.log('Sending data:', { id, updates });
//   const response = await editCartById(id, updates);
//   console.log('Response received:', response);
//   return response;
// });

export const editCartByIdThunk = createAsyncThunk('carts/editById', async ({ id, updates }) => {
  console.log('Sending data:', { id, updates });
  const response = await editCartById(id, updates);
  console.log('Response received:', response);
  return response;
});



export const clearCartThunk = createAsyncThunk('carts/clearCart', async () => {
  const response = await clearCart();
  return response;
});

const cartSlice = createSlice({
  name: 'carts',
  initialState: {
    currentCart: { items: [], totalPrice: 0 },
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
        state.currentCart = action.payload || { items: [], totalPrice: 0 };
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
        state.currentCart = action.payload || { items: [], totalPrice: 0 };
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
        state.allCarts = action.payload || [];
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
        state.currentCart = action.payload || { items: [], totalPrice: 0 };
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
        if (state.currentCart._id === action.payload) {
          state.currentCart = { items: [], totalPrice: 0 };
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
        if (state.currentCart._id === action.payload._id) {
          state.currentCart = action.payload || { items: [], totalPrice: 0 };
        }
      })
      .addCase(editCartByIdThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle clearCartThunk
      .addCase(clearCartThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.status = 'succeeded';
        state.currentCart = { items: [], totalPrice: 0 };
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
