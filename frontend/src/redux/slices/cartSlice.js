import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCartForCurrentUser,
  addItemsToCart,
  fetchAllCarts,
  fetchCartById,
  deleteCartById,
  editCartById,
  clearCart,
  addDiscount,
  addNote,
} from '../api/cartApiService';

// Async thunks
export const fetchCartForCurrentUserThunk = createAsyncThunk(
  'carts/fetchForCurrentUser',
  async () => {
    const response = await fetchCartForCurrentUser();
    return response; // Kembalikan respons langsung
  }
);

export const addItemsToCartThunk = createAsyncThunk('carts/addItems', async (items) => {
  const response = await addItemsToCart({ items });
  return response; // Kembalikan seluruh respons
});

export const fetchAllCartsThunk = createAsyncThunk('carts/fetchAllCarts', async () => {
  const response = await fetchAllCarts();
  return response; // Kembalikan seluruh respons
});

export const fetchCartByIdThunk = createAsyncThunk('carts/fetchById', async (id) => {
  const response = await fetchCartById(id);
  return response; // Kembalikan seluruh respons
});

export const deleteCartByIdThunk = createAsyncThunk('carts/deleteById', async (id) => {
  await deleteCartById(id);
  return id; // Kembalikan id untuk menghapus cart di state
});

export const editCartByIdThunk = createAsyncThunk('carts/editById', async ({ id, updates }, { rejectWithValue }) => {
  try {
      const response = await editCartById(id, updates);
      return response; // Kembalikan data dari respons
  } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Error editing cart');
  }
});

export const clearCartThunk = createAsyncThunk('carts/clearCart', async () => {
  const response = await clearCart();
  return response; // Kembalikan seluruh respons
});

// Thunk untuk menambahkan diskon
export const addDiscountThunk = createAsyncThunk('carts/addDiscount', async ({ discount, discountText }) => {
  const response = await addDiscount({ discount, discountText });
  return response; // Kembalikan seluruh respons
});

// Thunk untuk menambahkan catatan
export const addNoteThunk = createAsyncThunk('carts/addNote', async (note) => {
  const response = await addNote(note);
  return response; // Kembalikan seluruh respons
});

const cartSlice = createSlice({
  name: 'carts',
  initialState: { 
    currentCart: { 
      items: [], 
      additionalItems: [], 
      totalPrice: 0, 
      subTotal: 0, 
      totalQuantity: 0 
    },
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
        state.currentCart = action.payload; // Mengambil seluruh data cart
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
        state.currentCart = action.payload || state.currentCart; // Pastikan tidak mengubah currentCart jika payload kosong
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
        state.currentCart = action.payload || state.currentCart; // Pastikan tidak mengubah currentCart jika payload kosong
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
          state.currentCart = { items: [], totalPrice: 0 }; // Reset currentCart jika cart yang dihapus adalah currentCart
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
        const updatedItem = action.payload; // Mengambil data yang diupdate
        const itemIndex = state.currentCart.items.findIndex(item => item._id === updatedItem.productId);
      
        if (itemIndex >= 0) {
          state.currentCart.items[itemIndex] = updatedItem; // Update item yang ada
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
        state.currentCart = { 
          items: [], 
          additionalItems: [], 
          totalPrice: 0, 
          subTotal: 0, 
          totalQuantity: 0 
        };
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle addDiscountThunk
      .addCase(addDiscountThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addDiscountThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCart.totalPrice -= action.payload.discount || 0; // Pastikan diskon valid
      })
      .addCase(addDiscountThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handle addNoteThunk
      .addCase(addNoteThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addNoteThunk.fulfilled, (state) => {
        state.status = 'succeeded';
        // Logika tambahan untuk menambahkan catatan jika diperlukan
      })
      .addCase(addNoteThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default cartSlice.reducer;
