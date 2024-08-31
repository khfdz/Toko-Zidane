import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveCart, loadCart, deleteSaveCart, getAllSaveCarts, getSaveCartById } from '../api/cartSaveApiService';

// Async thunk for saving cart
export const saveCartThunk = createAsyncThunk('cartSave/saveCart', async (items) => {
    const response = await saveCart(items);
    return response;
});

// Async thunk for loading saved cart
export const loadCartThunk = createAsyncThunk('cartSave/loadCart', async (id) => {
    const response = await loadCart(id);
    return response;
});

// Async thunk for deleting saved cart
export const deleteSaveCartThunk = createAsyncThunk('cartSave/deleteSaveCart', async (id) => {
    const response = await deleteSaveCart(id);
    return response;
});

// Async thunk for getting all saved carts
export const getAllSaveCartsThunk = createAsyncThunk('cartSave/getAllSaveCarts', async () => {
    const response = await getAllSaveCarts();
    return response;
});

// Async thunk for getting saved cart by ID
export const getSaveCartByIdThunk = createAsyncThunk('cartSave/getSaveCartById', async (id) => {
    const response = await getSaveCartById(id);
    return response;
});

const cartSaveSlice = createSlice({
    name: 'cartSave',
    initialState: {
        saveCarts: [],
        currentCart: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearCurrentCart: (state) => {
            state.currentCart = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveCartThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(saveCartThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.saveCarts.push(action.payload);
            })
            .addCase(saveCartThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(loadCartThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadCartThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCart = action.payload;
            })
            .addCase(loadCartThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(deleteSaveCartThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteSaveCartThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.saveCarts = state.saveCarts.filter(cart => cart.id !== action.payload.id);
            })
            .addCase(deleteSaveCartThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getAllSaveCartsThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllSaveCartsThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.saveCarts = action.payload;
            })
            .addCase(getAllSaveCartsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(getSaveCartByIdThunk.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getSaveCartByIdThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentCart = action.payload;
            })
            .addCase(getSaveCartByIdThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearCurrentCart } = cartSaveSlice.actions;

export default cartSaveSlice.reducer;
