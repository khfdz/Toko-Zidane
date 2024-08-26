import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, getProductById, updateProductById, deleteProductById } from '../api/productApiService';

// Async thunk untuk mengambil semua produk dengan search query (ct_id, search)
export const fetchAllProducts = createAsyncThunk('products/fetchAll', async (searchQuery = {}) => {
  const response = await getAllProducts(searchQuery); // Kirimkan query params (search, ct_id) ke API service
  return response;
});

// Async thunk untuk mengambil produk berdasarkan ID
export const fetchProductById = createAsyncThunk('products/fetchById', async (id) => {
  const response = await getProductById(id);
  return response;
});

// Async thunk untuk memperbarui produk berdasarkan ID
export const updateProduct = createAsyncThunk('products/updateById', async ({ id, productData }) => {
  const response = await updateProductById(id, productData);
  return response;
});

// Async thunk untuk menghapus produk berdasarkan ID
export const deleteProduct = createAsyncThunk('products/deleteById', async (id) => {
  await deleteProductById(id); // Tidak perlu mengembalikan response jika tidak digunakan
  return id; // Mengembalikan ID untuk menghapus dari state
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProduct: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Menghandle fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Menghandle fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Menghandle updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.products.findIndex((product) => product._id === action.payload._id); // Gunakan _id dari MongoDB
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Menghandle deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = state.products.filter((product) => product._id !== action.payload); // Gunakan _id dari MongoDB
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
